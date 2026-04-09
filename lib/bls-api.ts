/**
 * BLS Public Data API v2 client.
 *
 * Fetches annual mean wages for specific occupations in the Jackson, MS MSA.
 * API docs: https://www.bls.gov/developers/api_signature_v2.htm
 *
 * Series ID format for OEWS (Occupational Employment and Wage Statistics):
 *   OEUS + area_code + industry_code + occupation_code + data_type_code
 *   - OEUS = OE (survey) + U (not seasonally adjusted) + S (state-level)
 *   - area_code: 7 digits — state FIPS padded with trailing zeros (Mississippi = 2800000)
 *   - industry_code: 6 digits — 000000 = all industries
 *   - occupation_code: 6 digits — SOC code without the dash (e.g. 29-1141 → 291141)
 *   - data_type_code: 2 digits — 04 = annual mean wage
 *   Example: OEUS280000000000029114104 — Mississippi, all industries, RNs, annual mean wage
 *
 * We use Mississippi state-level data (not Jackson MSA) for broader coverage.
 * MSA-level data is suppressed by BLS for smaller occupations in smaller metros.
 *
 * BLS free tier: 500 queries/day (no key), 50k/day (free registration key).
 * We send one multi-series request covering all careers — uses 1 query.
 */

export interface BLSWageData {
  /** SOC-level career ID matching CareerProfile.id */
  careerId: string;
  annualMeanWage: number;
  /** Year the data is from, e.g. "2024" */
  year: string;
  seriesId: string;
}

/**
 * BLS OEWS series IDs for the Jackson, MS MSA (area code 27420).
 * Data type 03 = annual mean wage.
 *
 * Mapping: career profile ID → BLS series ID
 *
 * Source: BLS Public Data API v2, verified 2026-04-08
 * Mississippi state-level (area 2800000), all industries, annual mean wage (type 04):
 *   - Heavy truck drivers (53-3032): OEUS280000000000053303204  → $55,240
 *   - IT support specialists (15-1232): OEUS280000000000015123204 → $50,540
 *   - CNAs (31-1131): OEUS280000000000031113104                   → $31,750
 *   - HVAC techs (49-9021): OEUS280000000000049902104             → $50,210
 *   - LPNs (29-2061): OEUS280000000000029206104                   → $49,960
 *   - Welders (51-4121): OEUS280000000000051412104                → $51,360
 *   - Business/Admin (43-6014): OEUS280000000000043601404         → $37,530
 *   - RNs (29-1141): OEUS280000000000029114104                    → $79,470
 */
const SERIES_MAP: Record<string, string> = {
  cdl_driver:     "OEUS280000000000053303204",
  it_support:     "OEUS280000000000015123204",
  cna:            "OEUS280000000000031113104",
  hvac_tech:      "OEUS280000000000049902104",
  lpn:            "OEUS280000000000029206104",
  welder:         "OEUS280000000000051412104",
  business_admin: "OEUS280000000000043601404",
  rn:             "OEUS280000000000029114104",
};

interface BLSApiSeriesData {
  seriesID: string;
  data: Array<{
    year: string;
    period: string;
    value: string;
    footnotes: Array<{ code?: string }>;
  }>;
}

interface BLSApiResponse {
  status: string;
  Results?: {
    series: BLSApiSeriesData[];
  };
  message?: string[];
}

/**
 * Fetches live wage data for all tracked careers in one API call.
 * Returns a map of careerId → BLSWageData, or an empty map on failure.
 *
 * Callers must treat an empty return as "data unavailable" and fall back
 * to static values — do not throw from this function.
 */
export async function fetchBLSWageData(): Promise<Map<string, BLSWageData>> {
  const results = new Map<string, BLSWageData>();

  const seriesIds = Object.values(SERIES_MAP);
  const registrationKey = process.env.BLS_API_KEY;

  const payload: Record<string, unknown> = {
    seriesid: seriesIds,
    startyear: "2024",
    endyear: "2024",
  };
  if (registrationKey) {
    payload.registrationkey = registrationKey;
  }

  let apiResponse: BLSApiResponse;
  try {
    const response = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.warn(`[bls-api] HTTP ${response.status} — using static data`);
      return results;
    }

    apiResponse = (await response.json()) as BLSApiResponse;
  } catch (err) {
    console.warn("[bls-api] Fetch failed:", err instanceof Error ? err.message : err);
    return results;
  }

  if (apiResponse.status !== "REQUEST_SUCCEEDED" || !apiResponse.Results) {
    console.warn("[bls-api] API returned status:", apiResponse.status, apiResponse.message);
    return results;
  }

  // Build a reverse map from series ID → career ID for fast lookup
  const reverseMap = new Map(Object.entries(SERIES_MAP).map(([id, sid]) => [sid, id]));

  for (const series of apiResponse.Results.series) {
    const careerId = reverseMap.get(series.seriesID);
    if (!careerId) continue;

    // Take the most recent annual data point (highest year, annual period A01)
    const annualPoints = series.data.filter((d) => d.period === "A01");
    if (annualPoints.length === 0) continue;

    annualPoints.sort((a, b) => Number(b.year) - Number(a.year));
    const latest = annualPoints[0];

    const wage = Number(latest.value);
    if (isNaN(wage) || wage <= 0) continue;

    results.set(careerId, {
      careerId,
      annualMeanWage: wage,
      year: latest.year,
      seriesId: series.seriesID,
    });
  }

  console.log(`[bls-api] Fetched live wages for ${results.size}/${seriesIds.length} careers`);
  return results;
}
