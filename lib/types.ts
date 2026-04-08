// ---- Intake Form Types ----

export type EducationLevel =
  | "less_than_hs"
  | "hs_diploma_ged"
  | "some_college"
  | "associates"
  | "bachelors"
  | "graduate";

export type IncomeRange =
  | "under_20k"
  | "20k_30k"
  | "30k_45k"
  | "45k_60k"
  | "over_60k";

export type TimeAvailability =
  | "less_6mo"
  | "6mo_1yr"
  | "1yr_2yr"
  | "2yr_4yr"
  | "flexible";

export type CareerSector =
  | "healthcare"
  | "trades"
  | "transportation"
  | "technology"
  | "education"
  | "business_admin"
  | "manufacturing"
  | "public_service";

export interface UserProfile {
  // Step 1 — Background
  currentEducation: EducationLevel;
  ageRange: "18-24" | "25-34" | "35-44" | "45-54" | "55+";
  currentIncome: IncomeRange;
  currentOccupation: string;
  county: string;
  // Step 2 — Constraints
  timeAvailable: TimeAvailability;
  canRelocate: boolean;
  hasTransportation: boolean;
  financialSituation: "stable" | "tight" | "crisis";
  hasChildcare: boolean;
  hasEldercareObligation: boolean;
  estimatedUpfrontBudget: "none" | "under_1k" | "1k_5k" | "5k_15k" | "over_15k";
  // Step 3 — Interests
  interestedSectors: CareerSector[];
  existingSkills: string[];
  workPreference: "indoor" | "outdoor" | "mixed";
  physicalDemands: "sedentary" | "light" | "moderate" | "heavy";
  goalStatement: string;
}

// ---- Career Pathway Output Types ----

export type ConfidenceLevel = "high" | "medium" | "low";

export type PathwayType =
  | "vocational_cert"
  | "associates_degree"
  | "bachelors_degree"
  | "industry_cert"
  | "apprenticeship"
  | "direct_entry";

export interface SalaryRange {
  low: number;
  median: number;
  high: number;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  source: string;
}

export interface ProgramOption {
  name: string;
  institution: string;
  location: string;
  estimatedCost: number;
  duration: string;
}

export interface NextStep {
  order: number;
  action: string;
  timeframe: string;
  cost: number;
  details: string;
}

export interface CostBenefit {
  totalTrainingCost: number;
  estimatedTimeToEmployment: string;
  firstYearIncome: number;
  breakEvenMonths: number;
  fiveYearNetGain: number;
  currentAnnualIncome: number;
}

export interface CareerPathway {
  id: string;
  pathName: string;
  description: string;
  pathwayType: PathwayType;
  fitScore: number;
  fitReason: string;
  timeToCompletion: string;
  estimatedCost: number;
  salaryRange: SalaryRange;
  programOptions: ProgramOption[];
  nextSteps: NextStep[];
  costBenefit: CostBenefit;
  barriers: string[];
  supports: string[];
}

export interface PathwayAnalysisResult {
  pathways: CareerPathway[];
  summary: string;
  counselorNote: string;
  generatedAt: string;
}

// ---- Income midpoints for cost-benefit math ----

export const INCOME_MIDPOINTS: Record<IncomeRange, number> = {
  under_20k: 15000,
  "20k_30k": 25000,
  "30k_45k": 37500,
  "45k_60k": 52500,
  over_60k: 70000,
};
