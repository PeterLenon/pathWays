import { UserProfile } from "./types";
import { CAREER_PROFILES, CareerProfile } from "./career-data";
import type { EnrichedCareerProfile } from "./pipeline";

/**
 * Builds the system prompt using only the static knowledge base.
 * Used as a fallback when pipeline.ts is not in the call stack.
 */
export function buildSystemPrompt(): string {
  return buildEnrichedSystemPrompt(CAREER_PROFILES);
}

/**
 * Builds a system prompt from a list of career profiles.
 * When profiles have been enriched with live BLS / Adzuna data, those fields
 * are surfaced as additional context. The LLM is instructed to prefer live
 * figures over static ones when present.
 */
export function buildEnrichedSystemPrompt(
  careers: (CareerProfile | EnrichedCareerProfile)[]
): string {
  const careerBlocks = careers
    .map((c) => {
      const enriched = c as EnrichedCareerProfile;
      const programs = c.programOptions
        .map(
          (p) =>
            `${p.institution}(${p.location},$${Math.round(p.estimatedCost / 1000)}k,${p.duration})`
        )
        .join("; ");
      const barriers = c.barriers.slice(0, 3).join(" | ");
      const supports = c.supports.slice(0, 3).join(" | ");

      // Live data lines — only included when the enrichment succeeded
      const liveWageLine =
        enriched.liveMedianWage && enriched.liveWageYear
          ? `LIVE_WAGE: $${enriched.liveMedianWage} mean (BLS OEWS ${enriched.liveWageYear}, prefer this over SALARY)`
          : "";
      const liveJobsLine =
        enriched.activeJobListings !== undefined
          ? `LIVE_DEMAND: ${enriched.activeJobListings} active listings${
              enriched.sampleEmployers?.length
                ? ` (hiring: ${enriched.sampleEmployers.join(", ")})`
                : ""
            }`
          : "";

      return [
        `ID:${c.id} NAME:${c.name}`,
        `SECTOR:${c.sector} TYPE:${c.pathwayType} FAST_ENTRY:${c.fastEntry}`,
        `COST:$${c.trainingCostLow}–$${c.trainingCostHigh} DURATION:${c.durationDescription}`,
        `SALARY: low=$${c.salaryLow} median=$${c.salaryMedian} high=$${c.salaryHigh}`,
        `CONFIDENCE:${c.salaryConfidence} SOURCE:${c.salarySource}`,
        `DEMAND:${c.demandLabel} PHYSICAL:${c.physicalDemands} ENV:${c.workEnvironment}`,
        liveWageLine,
        liveJobsLine,
        `PROGRAMS: ${programs}`,
        `BARRIERS: ${barriers}`,
        `SUPPORTS: ${supports}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return `You are a career advisor for Hinds County / Jackson, MS residents seeking higher income.

RULES:
1. Only recommend careers from the list below. Do not invent careers or programs.
2. Salary: always output low/median/high ranges — never a single number.
3. Use LIVE_WAGE when present for the median salary figure; otherwise use SALARY median.
4. Use confidence/source exactly as provided in the data.
5. If financialSituation=crisis: first pathway MUST be a fast_entry=true career.
6. counselorNote must mention: Hinds CC Career Services (601) 857-3200, MDES (601) 321-6000, MS Works (888) 844-3577.
7. programOptions: only use programs listed under each career. Do not invent institutions.
8. Output ONLY valid JSON matching the schema. No markdown, no extra text.
9. Compute costBenefit: currentAnnualIncome from (under_20k=15000,20k_30k=25000,30k_45k=37500,45k_60k=52500,over_60k=70000). breakEvenMonths=round(totalTrainingCost/((firstYearIncome-currentAnnualIncome)/12)). fiveYearNetGain=(firstYearIncome-currentAnnualIncome)*5-totalTrainingCost.

FINANCIAL AID (always surface relevant options):
- WIOA: federal training grants via MDES, covers CDL/healthcare/IT/trades at approved providers, (888) 844-3577
- Pell Grant: up to $7,395/yr for accredited programs, fafsa.gov
- MOSFA: MS state aid for community college, msfinancialaid.org
- C2C (Complete 2 Compete): for adults with some college, ihl.state.ms.us/complete2compete
- Hinds CC Workforce Development: scholarships for Hinds County residents, (601) 857-3200

CAREER DATA:
${careerBlocks}

OUTPUT SCHEMA (return exactly this structure):
{
  "pathways": [ // 2-3 items, ordered best fit first
    {
      "id": "string",
      "pathName": "string",
      "description": "string (1-2 sentences, advisory tone)",
      "pathwayType": "vocational_cert|associates_degree|bachelors_degree|industry_cert|apprenticeship|direct_entry",
      "fitScore": 1-100,
      "fitReason": "string (1 sentence why this fits this specific person)",
      "timeToCompletion": "string",
      "estimatedCost": number,
      "salaryRange": { "low": number, "median": number, "high": number, "confidence": "high|medium|low", "confidenceReason": "string", "source": "string" },
      "programOptions": [ { "name": "string", "institution": "string", "location": "string", "estimatedCost": number, "duration": "string" } ],
      "nextSteps": [ { "order": number, "action": "string", "timeframe": "This week|Within 30 days|Within 60 days", "cost": number, "details": "string" } ], // 2-3 items only
      "costBenefit": { "totalTrainingCost": number, "estimatedTimeToEmployment": "string", "firstYearIncome": number, "breakEvenMonths": number, "fiveYearNetGain": number, "currentAnnualIncome": number },
      "barriers": ["string"],
      "supports": ["string"]
    }
  ],
  "summary": "string (2-3 sentences summarizing the recommendations)",
  "counselorNote": "string (recommend free counselor resources with phone numbers)",
  "generatedAt": "string (ISO timestamp)"
}`;
}

/**
 * Concise user message — dynamic per submission.
 */
export function buildUserMessage(profile: UserProfile): string {
  const flags = [
    profile.canRelocate && "can-relocate",
    profile.hasTransportation && "has-transport",
    profile.hasChildcare && "has-childcare",
    profile.hasEldercareObligation && "has-eldercare",
  ]
    .filter(Boolean)
    .join(", ");

  return `Profile:
education=${profile.currentEducation} age=${profile.ageRange} income=${profile.currentIncome} occupation="${profile.currentOccupation || "unspecified"}" county=${profile.county}
time_available=${profile.timeAvailable} financial=${profile.financialSituation} budget=${profile.estimatedUpfrontBudget}
flags: ${flags || "none"}
sectors=${profile.interestedSectors.join(",")} skills=${profile.existingSkills.join(",") || "none"}
work_env=${profile.workPreference} physical=${profile.physicalDemands}
goal: "${profile.goalStatement}"

Generate exactly 2 pathway recommendations. Be concise. Return valid JSON only.`;
}
