"use client";

import { UseFormReturn } from "react-hook-form";
import { FullProfileData } from "@/lib/intake-schema";

interface Props {
  form: UseFormReturn<FullProfileData, unknown, FullProfileData>;
}

const sectorOptions = [
  { value: "healthcare", label: "Healthcare", icon: "medical_services" },
  { value: "trades", label: "Skilled Trades", icon: "construction" },
  { value: "transportation", label: "Transportation", icon: "local_shipping" },
  { value: "technology", label: "Technology", icon: "terminal" },
  { value: "education", label: "Education", icon: "school" },
  { value: "business_admin", label: "Business / Admin", icon: "business_center" },
  { value: "manufacturing", label: "Manufacturing", icon: "factory" },
  { value: "public_service", label: "Public Service", icon: "account_balance" },
];

const skillOptions = [
  "Customer service",
  "Driving",
  "Computer basics",
  "Manual labor",
  "Caretaking / caregiving",
  "Teaching or training others",
  "Managing people",
  "Sales",
  "Construction",
  "Healthcare basics",
  "Data entry",
  "Cooking / food service",
];

const workPrefOptions = [
  { value: "indoor", label: "Mostly indoors" },
  { value: "outdoor", label: "Mostly outdoors" },
  { value: "mixed", label: "Mix of both" },
];

const physicalOptions = [
  { value: "sedentary", label: "Desk / sedentary" },
  { value: "light", label: "Light activity" },
  { value: "moderate", label: "Moderate physical work" },
  { value: "heavy", label: "Heavy physical labor" },
];

const labelClass =
  "block text-xs font-label font-semibold text-outline mb-3 uppercase tracking-wider";

export default function Step3Interests({ form }: Props) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const selectedSectors = watch("interestedSectors") ?? [];
  const selectedSkills = watch("existingSkills") ?? [];
  const workPreference = watch("workPreference");
  const physicalDemands = watch("physicalDemands");

  function toggleSector(value: string) {
    const current = selectedSectors as string[];
    if (current.includes(value)) {
      setValue(
        "interestedSectors",
        current.filter((s) => s !== value) as FullProfileData["interestedSectors"]
      );
    } else if (current.length < 3) {
      setValue(
        "interestedSectors",
        [...current, value] as FullProfileData["interestedSectors"]
      );
    }
  }

  function toggleSkill(skill: string) {
    const current = selectedSkills as string[];
    if (current.includes(skill)) {
      setValue("existingSkills", current.filter((s) => s !== skill));
    } else {
      setValue("existingSkills", [...current, skill]);
    }
  }

  return (
    <div className="space-y-8">
      {/* Career Sectors */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary">explore</span>
          <h2 className="text-xl font-headline font-bold">Career Interests</h2>
        </div>

        <label className={labelClass}>
          Which career areas interest you?{" "}
          <span className="text-on-surface-variant font-normal normal-case tracking-normal">
            (pick 1–3)
          </span>{" "}
          <span className="text-error">*</span>
        </label>
        <p className="text-xs text-outline mb-3">{selectedSectors.length}/3 selected</p>

        <div className="grid grid-cols-2 gap-3">
          {sectorOptions.map((s) => {
            const selected = (selectedSectors as string[]).includes(s.value);
            const disabled = !selected && selectedSectors.length >= 3;
            return (
              <button
                key={s.value}
                type="button"
                disabled={disabled}
                onClick={() => toggleSector(s.value)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-label text-left transition-colors ${
                  selected
                    ? "bg-primary-fixed text-on-primary-fixed"
                    : disabled
                    ? "bg-surface-container text-on-surface-variant/40 cursor-not-allowed"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </div>
        {errors.interestedSectors && (
          <p className="mt-2 text-xs text-error">
            {errors.interestedSectors.message}
          </p>
        )}
      </div>

      {/* Existing Skills */}
      <div>
        <label className={labelClass}>
          Skills you already have{" "}
          <span className="text-on-surface-variant font-normal normal-case tracking-normal">
            (select all that apply)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill) => {
            const selected = (selectedSkills as string[]).includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-full text-xs font-medium font-label transition-colors ${
                  selected
                    ? "bg-primary-fixed text-on-primary-fixed"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Preference + Physical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClass}>
            Work environment <span className="text-error">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {workPrefOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() =>
                  setValue("workPreference", o.value as FullProfileData["workPreference"])
                }
                className={`py-3 px-4 rounded-xl text-sm font-medium font-label text-left transition-colors ${
                  workPreference === o.value
                    ? "bg-primary-fixed text-on-primary-fixed"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {errors.workPreference && (
            <p className="mt-1 text-xs text-error">
              {errors.workPreference.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Physical activity level <span className="text-error">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {physicalOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() =>
                  setValue("physicalDemands", o.value as FullProfileData["physicalDemands"])
                }
                className={`py-3 px-4 rounded-xl text-sm font-medium font-label text-left transition-colors ${
                  physicalDemands === o.value
                    ? "bg-primary-fixed text-on-primary-fixed"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {errors.physicalDemands && (
            <p className="mt-1 text-xs text-error">
              {errors.physicalDemands.message}
            </p>
          )}
        </div>
      </div>

      {/* Goal statement */}
      <div>
        <label className={labelClass}>
          In your own words, what&apos;s your goal? <span className="text-error">*</span>
        </label>
        <textarea
          {...register("goalStatement")}
          rows={3}
          placeholder="e.g. I want a stable job that lets me support my family and doesn't require me to go back to school for 4 years."
          className="w-full bg-surface-container-low border-none rounded-xl p-4 font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          maxLength={300}
        />
        <div className="flex justify-between mt-1">
          <span />
          <p className="text-xs text-outline">
            {watch("goalStatement")?.length ?? 0}/300
          </p>
        </div>
        {errors.goalStatement && (
          <p className="text-xs text-error">{errors.goalStatement.message}</p>
        )}
      </div>
    </div>
  );
}
