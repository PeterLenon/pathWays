/**
 * BLS Public Data API v2 client.
 *
 * Fetches annual mean wages for specific occupations in the Jackson, MS MSA.
 * API docs: https://www.bls.gov/developers/api_signature_v2.htm
 *
 * Series ID format for OEWS (Occupational Employment and Wage Statistics):
 *   OEU + area_code + industry_code + occupation_code + data_type_code
 *   Example: OEU0027420000000000053 — Jackson, MS MSA, all industries, all occupations, mean annual wage
 *
 * We query the series IDs that correspond to our 8 career profiles.
 * If the API is unavailable we fall back to the static career-data.ts values silently.
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
 * Source: https://data.bls.gov/oes/#/area/Metropolitan%20Statistical%20Areas
 * Jackson, MS MSA (area 0027420):
 *   - Heavy truck drivers (53-3032): OEU002742000000053303203
 *   - IT support specialists (15-1232): OEU002742000000015123203
 *   - CNAs (31-1131): OEU002742000000031113103  (31-1131 is the 2018 SOC for NAs)
 *   - HVAC techs (49-9021): OEU002742000000049902103
 *   - LPNs (29-2061): OEU002742000000029206103
 *   - Welders (51-4121): OEU002742000000051412103
 *   - Business/Admin (43-6014): OEU002742000000043601403 (secretaries/admin)
 *   - RNs (29-1141): OEU002742000000029114103
 *
 * Note: BLS series IDs are 20 chars. The format used by the Public Data API v2
 * for OEWS MSA data is: OEU + 7-digit area + 6-digit industry (000000=all) + 8-digit SOC + 2-digit data type
 */
const SERIES_MAP: Record<string, string> = {
  cdl_driver:     "OEU002742000000053303203",
  it_support:     "OEU002742000000015123203",
  cna:            "OEU002742000000031113103",
  hvac_tech:      "OEU002742000000049902103",
  lpn:            "OEU002742000000029206103",
  welder:         "OEU002742000000051412103",
  business_admin: "OEU002742000000043601403",
  rn:             "OEU002742000000029114103",
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
    startyear: "2023",
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

    // Take the most recent annual data point (highest year, annual period M13)
    const annualPoints = series.data.filter((d) => d.period === "M13");
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
