import { z } from "zod";

// No .default() calls here — defaults are managed in useForm's defaultValues.
// Zod v4 makes .default() fields optional in the input type, which breaks
// react-hook-form's resolver type inference.

export const step1Schema = z.object({
  currentEducation: z.enum([
    "less_than_hs",
    "hs_diploma_ged",
    "some_college",
    "associates",
    "bachelors",
    "graduate",
  ]),
  ageRange: z.enum(["18-24", "25-34", "35-44", "45-54", "55+"]),
  currentIncome: z.enum([
    "under_20k",
    "20k_30k",
    "30k_45k",
    "45k_60k",
    "over_60k",
  ]),
  currentOccupation: z.string().max(100),
  county: z.string(),
});

export const step2Schema = z.object({
  timeAvailable: z.enum([
    "less_6mo",
    "6mo_1yr",
    "1yr_2yr",
    "2yr_4yr",
    "flexible",
  ]),
  canRelocate: z.boolean(),
  hasTransportation: z.boolean(),
  financialSituation: z.enum(["stable", "tight", "crisis"]),
  hasChildcare: z.boolean(),
  hasEldercareObligation: z.boolean(),
  estimatedUpfrontBudget: z.enum([
    "none",
    "under_1k",
    "1k_5k",
    "5k_15k",
    "over_15k",
  ]),
});

export const step3Schema = z.object({
  interestedSectors: z
    .array(
      z.enum([
        "healthcare",
        "trades",
        "transportation",
        "technology",
        "education",
        "business_admin",
        "manufacturing",
        "public_service",
      ])
    )
    .min(1, "Select at least one area of interest")
    .max(3, "Select up to 3 areas"),
  existingSkills: z.array(z.string()),
  workPreference: z.enum(["indoor", "outdoor", "mixed"]),
  physicalDemands: z.enum(["sedentary", "light", "moderate", "heavy"]),
  goalStatement: z
    .string()
    .min(10, "Please share a bit more about your goal (at least 10 characters)")
    .max(300, "Please keep your goal to 300 characters or less"),
});

export const fullProfileSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type FullProfileData = z.infer<typeof fullProfileSchema>;
