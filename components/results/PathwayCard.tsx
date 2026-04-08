"use client";

import Link from "next/link";
import { CareerPathway } from "@/lib/types";

interface Props {
  pathway: CareerPathway;
  rank: number;
}

const pathwayTypeLabels: Record<string, string> = {
  vocational_cert: "Vocational Certificate",
  associates_degree: "Associate's Degree",
  bachelors_degree: "Bachelor's Degree",
  industry_cert: "Industry Certification",
  apprenticeship: "Apprenticeship",
  direct_entry: "Direct Entry",
};

const pathwayIcons: Record<string, string> = {
  vocational_cert: "construction",
  associates_degree: "school",
  bachelors_degree: "account_balance",
  industry_cert: "verified",
  apprenticeship: "engineering",
  direct_entry: "work",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

const demandColors: Record<string, string> = {
  very_high: "text-secondary",
  high: "text-secondary",
  moderate: "text-on-surface-variant",
  low: "text-on-surface-variant",
};

const demandLabels: Record<string, string> = {
  very_high: "Critical",
  high: "High",
  moderate: "Moderate",
  low: "Low",
};

export default function PathwayCard({ pathway, rank }: Props) {
  const fitLabel =
    pathway.fitScore >= 80
      ? "Strong Match"
      : pathway.fitScore >= 60
      ? "Good Match"
      : "Possible Match";

  const salaryStr = `${fmt(pathway.salaryRange.low)}–${fmt(pathway.salaryRange.high)}`;
  const icon = pathwayIcons[pathway.pathwayType] ?? "work";

  return (
    <div className="group bg-surface-container-lowest rounded-xl p-6 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="bg-surface-container p-3 rounded-xl">
          <span className="material-symbols-outlined text-primary text-3xl">
            {icon}
          </span>
        </div>
        <span className="bg-secondary-container/30 text-secondary font-bold text-[10px] px-2 py-1 rounded-full tracking-wider uppercase">
          {pathway.fitScore}% {fitLabel}
        </span>
      </div>

      {/* Title & type */}
      <h3 className="text-xl font-bold font-headline mb-1">{pathway.pathName}</h3>
      <p className="text-xs text-on-surface-variant font-label mb-4">
        {pathwayTypeLabels[pathway.pathwayType] ?? pathway.pathwayType}
      </p>
      <p className="text-sm text-on-surface-variant leading-relaxed mb-6 flex-grow">
        {pathway.fitReason}
      </p>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant">Potential Salary</span>
          <span className="font-bold text-primary">{salaryStr}</span>
        </div>
        <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full"
            style={{ width: `${Math.min(pathway.fitScore, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant">Time to Complete</span>
          <span className="font-bold">{pathway.timeToCompletion}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant">Est. Cost</span>
          <span className="font-bold">{fmt(pathway.estimatedCost)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant">Break-even</span>
          <span className={`font-bold ${demandColors["high"]}`}>
            {pathway.costBenefit.breakEvenMonths >= 999
              ? "N/A"
              : `${pathway.costBenefit.breakEvenMonths}mo`}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/results/${pathway.id}`}
        className="w-full py-3 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all text-center block"
      >
        View Roadmap
      </Link>
    </div>
  );
}
