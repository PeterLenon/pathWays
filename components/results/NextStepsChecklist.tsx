import { NextStep } from "@/lib/types";

interface Props {
  steps: NextStep[];
}

function fmt(n: number) {
  if (n === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function NextStepsChecklist({ steps }: Props) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <ol className="space-y-3">
      {sorted.map((step) => (
        <li key={step.order} className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center mt-0.5">
            {step.order}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-800">{step.action}</p>
              <span className="flex-shrink-0 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded px-2 py-0.5">
                {step.timeframe}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{step.details}</p>
            {step.cost > 0 && (
              <p className="text-xs text-sky-600 mt-0.5 font-medium">
                Cost: {fmt(step.cost)}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
