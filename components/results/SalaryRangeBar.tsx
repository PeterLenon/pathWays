import { SalaryRange } from "@/lib/types";

interface Props {
  salaryRange: SalaryRange;
}

const confidenceConfig = {
  high: {
    label: "High confidence",
    classes: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  medium: {
    label: "Medium confidence",
    classes: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  low: {
    label: "Low confidence",
    classes: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
};

function fmt(n: number) {
  return "$" + Math.round(n / 1000) + "K";
}

export default function SalaryRangeBar({ salaryRange }: Props) {
  const config = confidenceConfig[salaryRange.confidence];
  const { low, median, high } = salaryRange;
  const range = high - low;

  // Position median as a percentage along the bar
  const medianPct = range > 0 ? ((median - low) / range) * 100 : 50;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">Estimated Annual Salary</p>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${config.classes}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-3 bg-sky-100 rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-200 to-sky-400 rounded-full" />
        {/* Median marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-sky-700 rounded-full border-2 border-white shadow"
          style={{ left: `${medianPct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-slate-500">
        <div>
          <p className="font-semibold text-slate-700 text-base">{fmt(low)}</p>
          <p>Low end</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-sky-700 text-base">{fmt(median)}</p>
          <p>Typical</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-700 text-base">{fmt(high)}</p>
          <p>High end</p>
        </div>
      </div>

      {/* Confidence note */}
      <p className="text-xs text-slate-400 leading-relaxed">
        {salaryRange.confidenceReason} Source: {salaryRange.source}
      </p>
    </div>
  );
}
