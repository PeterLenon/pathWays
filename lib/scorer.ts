/**
 * Rule-based career scorer. Pre-selects the top 3 careers from the hardcoded
 * list before sending to the LLM. This keeps the LLM prompt small enough for
 * free-tier token limits, and prevents hallucination by giving the LLM only
 * pre-vetted data to work with.
 */

import { UserProfile } from "./types";
import { CAREER_PROFILES, CareerProfile } from "./career-data";

const TIME_MONTHS: Record<string, number> = {
  less_6mo: 5,
  "6mo_1yr": 11,
  "1yr_2yr": 23,
  "2yr_4yr": 47,
  flexible: 99,
};

const DURATION_MONTHS: Record<string, number> = {
  cdl_driver: 2,
  it_support: 5,
  cna: 2,
  hvac_tech: 9,
  lpn: 14,
  welder: 9,
  business_admin: 24,
  rn: 24,
};

const BUDGET_MAX: Record<string, number> = {
  none: 0,
  under_1k: 1000,
  "1k_5k": 5000,
  "5k_15k": 15000,
  over_15k: 99999,
};

function scoreSector(career: CareerProfile, profile: UserProfile): number {
  return profile.interestedSectors.includes(
    career.sector as UserProfile["interestedSectors"][number]
  )
    ? 40
    : 0;
}

function scoreTime(career: CareerProfile, profile: UserProfile): number {
  const allowed = TIME_MONTHS[profile.timeAvailable] ?? 99;
  const needed = DURATION_MONTHS[career.id] ?? 12;
  return needed <= allowed ? 20 : -30;
}

function scorePhysical(career: CareerProfile, profile: UserProfile): number {
  const physRank = { sedentary: 0, light: 1, moderate: 2, heavy: 3 };
  const userRank = physRank[profile.physicalDemands] ?? 2;
  const careerRank = physRank[career.physicalDemands] ?? 2;
  if (careerRank <= userRank) return 15;
  if (careerRank === userRank + 1) return 0;
  return -20;
}

function scoreEnv(career: CareerProfile, profile: UserProfile): number {
  if (profile.workPreference === "mixed") return 10;
  return career.workEnvironment === profile.workPreference ? 10 : -5;
}

function scoreBudget(career: CareerProfile, profile: UserProfile): number {
  const max = BUDGET_MAX[profile.estimatedUpfrontBudget] ?? 5000;
  if (career.trainingCostLow <= max) return 15;
  // Check if WIOA is realistic (it covers most vocational programs)
  if (career.trainingCostLow <= 8000) return 5; // WIOA often covers this
  return 0;
}

function scoreDemand(career: CareerProfile): number {
  return { very_high: 15, high: 10, moderate: 5, low: 0 }[career.demandLabel] ?? 5;
}

export function selectTopCareers(profile: UserProfile, count = 4): CareerProfile[] {
  const crisisMode = profile.financialSituation === "crisis";

  const scored = CAREER_PROFILES.map((career) => {
    let score =
      scoreSector(career, profile) +
      scoreTime(career, profile) +
      scorePhysical(career, profile) +
      scoreEnv(career, profile) +
      scoreBudget(career, profile) +
      scoreDemand(career);

    // In crisis, heavily boost fast-entry options
    if (crisisMode && career.fastEntry) score += 50;
    if (crisisMode && !career.fastEntry) score -= 20;

    return { career, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // In crisis: ensure at least one fast-entry career is included
  const selected = scored.slice(0, count).map((s) => s.career);
  if (crisisMode && !selected.some((c) => c.fastEntry)) {
    const fastEntry = scored.find((s) => s.career.fastEntry);
    if (fastEntry) {
      selected.pop();
      selected.unshift(fastEntry.career);
    }
  }

  return selected;
}
