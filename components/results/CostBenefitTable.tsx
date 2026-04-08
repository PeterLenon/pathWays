import { CostBenefit } from "@/lib/types";

interface Props {
  costBenefit: CostBenefit;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CostBenefitTable({ costBenefit }: Props) {
  const netGainPositive = costBenefit.fiveYearNetGain > 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-slate-500 text-xs mb-1">Training cost (est.)</p>
          <p className="font-semibold text-slate-800">{fmt(costBenefit.totalTrainingCost)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-slate-500 text-xs mb-1">Time to employment</p>
          <p className="font-semibold text-slate-800">{costBenefit.estimatedTimeToEmployment}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-slate-500 text-xs mb-1">Current income (est.)</p>
          <p className="font-semibold text-slate-800">{fmt(costBenefit.currentAnnualIncome)}/yr</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-slate-500 text-xs mb-1">First-year income (est.)</p>
          <p className="font-semibold text-sky-700">{fmt(costBenefit.firstYearIncome)}/yr</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-slate-500 text-xs mb-1">Break-even point</p>
          <p className="font-semibold text-slate-800">
            {costBenefit.breakEvenMonths >= 999
              ? "Not projected"
              : `~${costBenefit.breakEvenMonths} months`}
          </p>
        </div>
        <div
          className={`rounded-lg p-3 ${
            netGainPositive ? "bg-green-50" : "bg-slate-50"
          }`}
        >
          <p className="text-slate-500 text-xs mb-1">5-year net gain (est.)</p>
          <p
            className={`font-semibold ${
              netGainPositive ? "text-green-700" : "text-slate-800"
            }`}
          >
            {netGainPositive ? "+" : ""}
            {fmt(costBenefit.fiveYearNetGain)}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Cost-benefit figures are estimates based on typical salary ranges and training costs. Your actual results will vary.
      </p>
    </div>
  );
}
