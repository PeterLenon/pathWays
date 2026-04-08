"use client";

import { UseFormReturn } from "react-hook-form";
import { FullProfileData } from "@/lib/intake-schema";

interface Props {
  form: UseFormReturn<FullProfileData, unknown, FullProfileData>;
}

const educationOptions = [
  { value: "less_than_hs", label: "Less than high school" },
  { value: "hs_diploma_ged", label: "High school diploma or GED" },
  { value: "some_college", label: "Some college (no degree)" },
  { value: "associates", label: "Associate's degree" },
  { value: "bachelors", label: "Bachelor's degree" },
  { value: "graduate", label: "Graduate degree" },
];

const incomeOptions = [
  { value: "under_20k", label: "Under $20,000" },
  { value: "20k_30k", label: "$20,000 – $30,000" },
  { value: "30k_45k", label: "$30,000 – $45,000" },
  { value: "45k_60k", label: "$45,000 – $60,000" },
  { value: "over_60k", label: "Over $60,000" },
];

const ageOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];

const countyOptions = ["Hinds", "Rankin", "Madison", "Copiah", "Other (Jackson MSA)"];

const fieldClass =
  "w-full bg-surface-container-low border-none rounded-xl p-4 font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";

const labelClass =
  "block text-xs font-label font-semibold text-outline mb-2 uppercase tracking-wider";

export default function Step1Background({ form }: Props) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const selectedAge = watch("ageRange");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary">school</span>
          <h2 className="text-xl font-headline font-bold">Academic Foundation</h2>
        </div>

        {/* Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className={labelClass}>
              Highest level completed <span className="text-error">*</span>
            </label>
            <select {...register("currentEducation")} className={fieldClass}>
              <option value="">Select education level</option>
              {educationOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.currentEducation && (
              <p className="mt-1 text-xs text-error">
                {errors.currentEducation.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Current job or occupation{" "}
              <span className="text-outline font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              {...register("currentOccupation")}
              type="text"
              placeholder='e.g. "cashier", "truck driver"'
              className={fieldClass}
            />
          </div>
        </div>

        {/* Age Range */}
        <div className="mb-8">
          <label className={labelClass}>
            Age range <span className="text-error">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ageOptions.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() =>
                  setValue("ageRange", age as FullProfileData["ageRange"])
                }
                className={`px-5 py-2.5 rounded-full text-sm font-medium font-label transition-colors ${
                  selectedAge === age
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
          {errors.ageRange && (
            <p className="mt-1 text-xs text-error">{errors.ageRange.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary">monetization_on</span>
          <h2 className="text-xl font-headline font-bold">Economic Context</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              Estimated annual income <span className="text-error">*</span>
            </label>
            <select {...register("currentIncome")} className={fieldClass}>
              <option value="">Select income range</option>
              {incomeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.currentIncome && (
              <p className="mt-1 text-xs text-error">
                {errors.currentIncome.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              County <span className="text-error">*</span>
            </label>
            <select {...register("county")} className={fieldClass}>
              {countyOptions.map((c) => (
                <option key={c} value={c}>
                  {c} County
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
