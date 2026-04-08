"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  fullProfileSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  FullProfileData,
} from "@/lib/intake-schema";
import StepIndicator from "./StepIndicator";
import Step1Background from "./Step1Background";
import Step2Constraints from "./Step2Constraints";
import Step3Interests from "./Step3Interests";

const STEP_LABELS = ["Background", "Situation", "Interests"];
const TOTAL_STEPS = 3;
const stepSchemas = [step1Schema, step2Schema, step3Schema];

const sidebarContent: Record<
  number,
  { badge: string; headline: string; body: string; tip: string }
> = {
  1: {
    badge: "Market Insight",
    headline: "Hinds County is seeing a 12% surge in Healthcare Logistics.",
    body: "Users with high-school diplomas in your area are currently seeing the fastest ROI in specialized certification programs.",
    tip: 'Most Hinds County employers now prioritize \u201cSkills-Based\u201d hiring over traditional 4-year degrees for technical roles.',
  },
  2: {
    badge: "Financial Aid",
    headline: "WIOA grants cover most vocational training costs in Mississippi.",
    body: "Workforce Innovation and Opportunity Act funding is available through MDES for CDL, healthcare, IT, and trades programs — no repayment required.",
    tip: "Over 60% of IncomePath users qualify for at least partial grant funding based on their income level.",
  },
  3: {
    badge: "Career Insight",
    headline: "Trade certifications outperform 2-year degrees in 5-year ROI for Mississippi residents.",
    body: "Our analysis of 4.2M career trajectories shows that skills-based certificates in healthcare and trades yield the highest net income gain relative to training cost.",
    tip: "The top 3 fastest-growing occupations in Hinds County are all in Healthcare & Skilled Trades — exactly the sectors you're exploring.",
  },
};

export default function IntakeWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FullProfileData, unknown, FullProfileData>({
    resolver: zodResolver(fullProfileSchema),
    defaultValues: {
      county: "Hinds",
      canRelocate: false,
      hasTransportation: true,
      hasChildcare: false,
      hasEldercareObligation: false,
      interestedSectors: [],
      existingSkills: [],
      currentOccupation: "",
    },
    mode: "onTouched",
  });

  async function handleNext() {
    const schema = stepSchemas[currentStep - 1];
    const stepFields = Object.keys(schema.shape) as Array<keyof FullProfileData>;
    const valid = await form.trigger(stepFields);
    if (valid) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    const schema = stepSchemas[currentStep - 1];
    const stepFields = Object.keys(schema.shape) as Array<keyof FullProfileData>;
    const valid = await form.trigger(stepFields);
    if (!valid) return;

    const data = form.getValues();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile: data }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Something went wrong");
      }

      const result = await response.json();
      sessionStorage.setItem("pathwayResults", JSON.stringify(result));
      sessionStorage.setItem("userProfile", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  const sidebar = sidebarContent[currentStep];

  return (
    <div className="pb-24 px-6 pt-10">
      <div className="max-w-6xl mx-auto">
        {/* Progress indicator */}
        <div className="max-w-3xl mx-auto mb-10">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            labels={STEP_LABELS}
          />
        </div>

        {/* 12-col grid: 8-col form + 4-col sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Canvas */}
          <section className="lg:col-span-8 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-sm">
            <div className="space-y-10">
              {currentStep === 1 && <Step1Background form={form} />}
              {currentStep === 2 && <Step2Constraints form={form} />}
              {currentStep === 3 && <Step3Interests form={form} />}

              {submitError && (
                <div className="p-4 bg-error-container rounded-xl text-on-error-container text-sm">
                  {submitError}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-primary-fixed text-on-primary-fixed rounded-full font-headline font-bold hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                )}

                <div className="flex-1" />

                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 md:flex-none editorial-gradient text-on-primary py-4 px-10 rounded-full font-headline font-bold text-lg hover:opacity-90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    Continue
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none editorial-gradient text-on-primary py-4 px-10 rounded-full font-headline font-bold text-lg hover:opacity-90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Analyzing your career paths…
                      </>
                    ) : (
                      <>
                        Analyze Career Paths
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Editorial Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Market Insight Card */}
            <div className="bg-surface-container p-8 rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                  {sidebar.badge}
                </span>
                <h3 className="text-xl font-headline font-extrabold text-on-surface leading-tight mb-4">
                  {sidebar.headline}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {sidebar.body}
                </p>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            {/* Did you know? */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-secondary">
              <div className="flex gap-4">
                <div className="bg-secondary-container/30 p-3 rounded-full h-fit flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lightbulb
                  </span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface mb-1">
                    Did you know?
                  </h4>
                  <p className="text-sm text-outline mt-1 leading-relaxed">
                    {sidebar.tip}
                  </p>
                </div>
              </div>
            </div>

            {/* Data trust note */}
            <div className="p-4 rounded-xl bg-surface-container-low">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-on-surface">Advisory tool — not a guarantee.</span>{" "}
                Salary data sourced from BLS OES, Jackson MSA (May 2024). Verify program details directly with institutions before enrolling.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
