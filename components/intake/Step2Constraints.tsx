"use client";

import { UseFormReturn } from "react-hook-form";
import { FullProfileData } from "@/lib/intake-schema";

interface Props {
  form: UseFormReturn<FullProfileData, unknown, FullProfileData>;
}

const timeOptions = [
  { value: "less_6mo", label: "Less than 6 months" },
  { value: "6mo_1yr", label: "6 months – 1 year" },
  { value: "1yr_2yr", label: "1 – 2 years" },
  { value: "2yr_4yr", label: "2 – 4 years" },
  { value: "flexible", label: "Flexible / as long as needed" },
];

const financialOptions = [
  {
    value: "stable",
    label: "Stable",
    description: "I can cover training costs without major hardship",
  },
  {
    value: "tight",
    label: "Tight",
    description: "I need financial assistance but am not in immediate crisis",
  },
  {
    value: "crisis",
    label: "In crisis",
    description: "I need income as quickly as possible",
  },
];

const budgetOptions = [
  { value: "none", label: "None available right now" },
  { value: "under_1k", label: "Under $1,000" },
  { value: "1k_5k", label: "$1,000 – $5,000" },
  { value: "5k_15k", label: "$5,000 – $15,000" },
  { value: "over_15k", label: "Over $15,000" },
];

const labelClass =
  "block text-xs font-label font-semibold text-outline mb-2 uppercase tracking-wider";

const fieldClass =
  "w-full bg-surface-container-low border-none rounded-xl p-4 font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
        checked
          ? "bg-surface-container border-b-2 border-primary"
          : "bg-surface-container-low hover:bg-surface-container"
      }`}
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="text-sm font-medium text-on-surface">{label}</p>
        {description && (
          <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
        )}
      </div>
      <div
        className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ml-4 ${
          checked ? "bg-primary" : "bg-surface-container-highest"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
}

export default function Step2Constraints({ form }: Props) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const canRelocate = watch("canRelocate");
  const hasTransportation = watch("hasTransportation");
  const hasChildcare = watch("hasChildcare");
  const hasEldercareObligation = watch("hasEldercareObligation");
  const financialSituation = watch("financialSituation");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary">schedule</span>
          <h2 className="text-xl font-headline font-bold">Time &amp; Budget</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className={labelClass}>
              Training time available <span className="text-error">*</span>
            </label>
            <select
              {...register("timeAvailable")}
              className={fieldClass}
            >
              <option value="">Select time availability</option>
              {timeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.timeAvailable && (
              <p className="mt-1 text-xs text-error">
                {errors.timeAvailable.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Upfront training budget <span className="text-error">*</span>
            </label>
            <select
              {...register("estimatedUpfrontBudget")}
              className={fieldClass}
            >
              <option value="">Select budget</option>
              {budgetOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.estimatedUpfrontBudget && (
              <p className="mt-1 text-xs text-error">
                {errors.estimatedUpfrontBudget.message}
              </p>
            )}
          </div>
        </div>

        {/* Financial situation */}
        <div>
          <label className={labelClass}>
            Financial situation <span className="text-error">*</span>
          </label>
          <div className="space-y-3">
            {financialOptions.map((o) => (
              <div
                key={o.value}
                onClick={() =>
                  setValue(
                    "financialSituation",
                    o.value as FullProfileData["financialSituation"]
                  )
                }
                className={`p-4 rounded-xl cursor-pointer transition-colors ${
                  financialSituation === o.value
                    ? "bg-surface-container border-b-2 border-primary"
                    : "bg-surface-container-low hover:bg-surface-container"
                }`}
              >
                <p className="text-sm font-medium text-on-surface">{o.label}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {o.description}
                </p>
              </div>
            ))}
          </div>
          {errors.financialSituation && (
            <p className="mt-1 text-xs text-error">
              {errors.financialSituation.message}
            </p>
          )}
        </div>
      </div>

      {/* Life circumstances */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <h2 className="text-xl font-headline font-bold">Your Circumstances</h2>
        </div>

        <div className="space-y-3">
          <Toggle
            label="I have reliable transportation"
            description="Car, consistent ride, or public transit access"
            checked={!!hasTransportation}
            onChange={(v) => setValue("hasTransportation", v)}
          />
          <Toggle
            label="I can relocate within Mississippi for work"
            checked={!!canRelocate}
            onChange={(v) => setValue("canRelocate", v)}
          />
          <Toggle
            label="I have children under 18 at home"
            description="Affects scheduling flexibility for classes and clinicals"
            checked={!!hasChildcare}
            onChange={(v) => setValue("hasChildcare", v)}
          />
          <Toggle
            label="I have eldercare responsibilities"
            checked={!!hasEldercareObligation}
            onChange={(v) => setValue("hasEldercareObligation", v)}
          />
        </div>
      </div>
    </div>
  );
}
