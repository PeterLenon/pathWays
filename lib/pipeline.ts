/**
 * Analysis pipeline orchestrator.
 *
 * Stages (executed in order):
 *   1. Rule-based scoring — selects top 4 careers from the static knowledge base
 *   2. BLS enrichment — overlays live mean wages from the BLS OEWS API
 *   3. Adzuna enrichment — overlays live job demand signals from current postings
 *   4. LLM inference — generates personalized pathways using enriched career data
 *
 * Stages 2 and 3 run concurrently. Either can fail silently; the pipeline always
 * completes as long as the LLM responds. Static data is the floor, live data is
 * the ceiling — never a hard dependency.
 */

import { UserProfile, PathwayAnalysisResult } from "./types";
import { CareerProfile } from "./career-data";
import { selectTopCareers } from "./scorer";
import { fetchBLSWageData, BLSWageData } from "./bls-api";
import { fetchJobsDemandData, JobsDemandData } from "./jobs-api";
import { getLLMClient } from "./llm";
import { buildEnrichedSystemPrompt, buildUserMessage } from "./prompt-builder";

export interface EnrichedCareerProfile extends CareerProfile {
  liveMedianWage?: number;
  liveWageYear?: string;
  activeJobListings?: number;
  postingMedianSalary?: number | null;
  sampleEmployers?: string[];
}

/**
 * Merges static career profiles with live BLS and Adzuna data.
 * Live data is applied only where available; static data is never removed.
 */
function enrichCareers(
  careers: CareerProfile[],
  blsData: Map<string, BLSWageData>,
  jobsData: Map<string, JobsDemandData>
): EnrichedCareerProfile[] {
  return careers.map((career) => {
    const bls = blsData.get(career.id);
    const jobs = jobsData.get(career.id);

    return {
      ...career,
      liveMedianWage: bls?.annualMeanWage,
      liveWageYear: bls?.year,
      activeJobListings: jobs?.activeListings,
      postingMedianSalary: jobs?.postingMedianSalary,
      sampleEmployers: jobs?.sampleEmployers,
    };
  });
}

/**
 * Runs the full analysis pipeline for a given user profile.
 * Throws only on LLM failure (unrecoverable). Data enrichment errors are
 * absorbed with console warnings and degrade to static data.
 */
export async function runAnalysisPipeline(
  userProfile: UserProfile
): Promise<PathwayAnalysisResult> {
  // Stage 1: Rule-based pre-selection
  const topCareers = selectTopCareers(userProfile, 3);
  const careerIds = topCareers.map((c) => c.id);

  console.log(`[pipeline] Selected careers: ${careerIds.join(", ")}`);

  // Stage 2 & 3: Concurrent data enrichment
  const [blsData, jobsData] = await Promise.all([
    fetchBLSWageData(),
    fetchJobsDemandData(careerIds),
  ]);

  // Merge live data onto static profiles
  const enrichedCareers = enrichCareers(topCareers, blsData, jobsData);

  // Stage 4: LLM inference
  const llm = getLLMClient();
  console.log(`[pipeline] Invoking LLM: model=${llm.model}`);

  const systemPrompt = buildEnrichedSystemPrompt(enrichedCareers);
  const userMessage = buildUserMessage(userProfile);

  const completion = await llm.chat.completions.create({
    model: llm.model,
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const rawText = completion.choices[0]?.message?.content ?? "";

  if (!rawText.trim()) {
    throw new Error("LLM returned an empty response");
  }

  let parsed: PathwayAnalysisResult;
  try {
    parsed = JSON.parse(rawText) as PathwayAnalysisResult;
  } catch {
    console.error("[pipeline] LLM response was not valid JSON (length=%d): %s", rawText.length, rawText.slice(-200));
    throw new Error("AI returned an unexpected format — please try again");
  }

  parsed.generatedAt = new Date().toISOString();

  console.log(`[pipeline] Generated ${parsed.pathways?.length ?? 0} pathways`);
  return parsed;
}
