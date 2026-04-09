/**
 * Adzuna job postings API client.
 *
 * Used to get a live demand signal (active job count + salary data from postings)
 * for careers in the Jackson, MS area. This supplements BLS's annual survey data
 * with real-time employer demand.
 *
 * API docs: https://developer.adzuna.com/docs/search
 * Free tier: 1,000 calls/month — sufficient for MVP given caching.
 *
 * Strategy: one API call per career profile, results cached in memory for the
 * duration of the Next.js process (server restarts clear the cache). In a
 * production system this would be cached in Supabase with a 24-hour TTL.
 *
 * We make calls sequentially to avoid triggering Adzuna's per-second rate limit.
 * One failure does not block the others — each is caught individually.
 */

export interface JobsDemandData {
  careerId: string;
  activeListings: number;
  /** Median salary from current postings, or null if insufficient data */
  postingMedianSalary: number | null;
  /** Sample employer names from active postings */
  sampleEmployers: string[];
  fetchedAt: string;
}

interface AdzunaSearchResponse {
  count: number;
  results: Array<{
    company: { display_name: string };
    salary_min?: number;
    salary_max?: number;
  }>;
}

/**
 * Search terms mapped from career profile IDs.
 * Adzuna full-text search — use the natural language title that appears in job ads.
 */
const SEARCH_TERMS: Record<string, string> = {
  cdl_driver:     "CDL truck driver",
  it_support:     "IT support specialist",
  cna:            "certified nursing assistant",
  hvac_tech:      "HVAC technician",
  lpn:            "licensed practical nurse",
  welder:         "welder",
  business_admin: "administrative assistant",
  rn:             "registered nurse",
};

/**
 * In-process cache. Stale after 24 hours to stay within the free tier budget.
 * Next.js production builds reuse the module scope across requests, so this
 * gives genuine caching on a long-running server.
 */
const CACHE = new Map<string, { data: JobsDemandData; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function fetchForCareer(
  careerId: string,
  appId: string,
  appKey: string
): Promise<JobsDemandData> {
  const cached = CACHE.get(careerId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const term = SEARCH_TERMS[careerId] ?? careerId.replace(/_/g, " ");
  const url = new URL("https://api.adzuna.com/v1/api/jobs/us/search/1");
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("what", term);
  url.searchParams.set("where", "Jackson, MS");
  url.searchParams.set("distance", "50"); // 50-mile radius covers the metro
  url.searchParams.set("results_per_page", "20");
  url.searchParams.set("content-type", "application/json");

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Adzuna HTTP ${response.status} for ${careerId}`);
  }

  const body = (await response.json()) as AdzunaSearchResponse;

  // Compute a rough median salary from postings that include a salary range
  const salariesFromPostings = body.results
    .filter((r) => r.salary_min && r.salary_max)
    .map((r) => ((r.salary_min ?? 0) + (r.salary_max ?? 0)) / 2);

  const postingMedianSalary =
    salariesFromPostings.length >= 3
      ? salariesFromPostings.reduce((a, b) => a + b, 0) / salariesFromPostings.length
      : null;

  const seen = new Set<string>();
  const sampleEmployers: string[] = [];
  for (const r of body.results.slice(0, 5)) {
    const name = r.company.display_name;
    if (!seen.has(name)) {
      seen.add(name);
      sampleEmployers.push(name);
    }
    if (sampleEmployers.length >= 3) break;
  }

  const result: JobsDemandData = {
    careerId,
    activeListings: body.count,
    postingMedianSalary: postingMedianSalary ? Math.round(postingMedianSalary) : null,
    sampleEmployers,
    fetchedAt: new Date().toISOString(),
  };

  CACHE.set(careerId, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
}

/**
 * Fetches live job demand data for the provided career IDs.
 * Returns a map of careerId → JobsDemandData.
 * Careers that fail (network error, API limit) are silently omitted.
 *
 * Returns an empty map when ADZUNA_APP_ID / ADZUNA_APP_KEY are not configured,
 * so development without credentials degrades gracefully.
 */
export async function fetchJobsDemandData(
  careerIds: string[]
): Promise<Map<string, JobsDemandData>> {
  const results = new Map<string, JobsDemandData>();

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.log("[jobs-api] Adzuna credentials not set — skipping demand enrichment");
    return results;
  }

  for (const id of careerIds) {
    try {
      const data = await fetchForCareer(id, appId, appKey);
      results.set(id, data);
    } catch (err) {
      console.warn(`[jobs-api] Failed for ${id}:`, err);
    }
  }

  console.log(`[jobs-api] Demand data for ${results.size}/${careerIds.length} careers`);
  return results;
}
