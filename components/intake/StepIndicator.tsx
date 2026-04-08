"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const stepTitles: Record<number, string> = {
  1: "Your Background",
  2: "Your Situation",
  3: "Your Interests",
};

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  const percentComplete = Math.round(((currentStep - 1) / totalSteps) * 100);
  const stepLabel = labels[currentStep - 1] ?? `Step ${currentStep}`;

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase block mb-1">
            Step {String(currentStep).padStart(2, "0")} of{" "}
            {String(totalSteps).padStart(2, "0")}
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface">
            {stepTitles[currentStep] ?? stepLabel}
          </h1>
        </div>
        <div className="text-right">
          <span className="text-secondary font-bold text-lg">
            {percentComplete}% Complete
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full editorial-gradient rounded-full transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  );
}
