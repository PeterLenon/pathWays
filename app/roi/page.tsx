"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PathwayAnalysisResult, CareerPathway } from "@/lib/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// sessionStorage is not available during SSR.
export const dynamic = "force-dynamic";

const PATHWAY_COLORS = ["bg-primary", "bg-secondary", "bg-tertiary-fixed-dim"];
const CHART_COLORS = ["bg-primary/40", "bg-secondary/40", "bg-tertiary-fixed-dim/40"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Cumulative net income at each year for one pathway.
 * Year 0 = -trainingCost (the investment).
 * Years 1-N = firstYearIncome * year - trainingCost.
 */
function cumulativeGains(pathway: CareerPathway, years: number): number[] {
  const { totalTrainingCost, firstYearIncome } = pathway.costBenefit;
  return Array.from({ length: years + 1 }, (_, yr) =>
    yr === 0 ? -totalTrainingCost : firstYearIncome * yr - totalTrainingCost
  );
}

export default function ROIPage() {
  const router = useRouter();
  const [result, setResult] = useState<PathwayAnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("pathwayResults");
    if (!raw) {
      router.replace("/assess");
      return;
    }
    try {
      setResult(JSON.parse(raw));
    } catch {
      router.replace("/assess");
    }
  }, [router]);

  if (!result) {
    return (
      <>
        <Nav activePage="roi" />
        <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container rounded-full">
            <svg className="animate-spin w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium text-on-surface-variant">Loading analysis…</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { pathways } = result;
  const YEARS = 10;

  // Normalise chart bars: find the highest cumulative gain at year YEARS
  const allGains = pathways.map((p) => cumulativeGains(p, YEARS));
  const maxGain = Math.max(...allGains.map((g) => g[YEARS]));

  // Break-even scale: 0–max or at least 24 months
  const maxBreakEven = Math.max(24, ...pathways.map((p) => p.costBenefit.breakEvenMonths));

  // Top pathway for the confidence card
  const top = pathways[0];

  return (
    <>
      <Nav activePage="roi" />

      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        {/* Page Header */}
        <section className="mb-12 mt-10">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary mb-4 leading-none">
            ROI Analysis
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-medium">
            Deep dive into the financial implications of your recommended career
            paths. Training costs, income gains, and your true break-even point —
            calculated for you.
          </p>
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Income Projection Chart */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="font-headline text-2xl font-bold text-primary">
                  Cumulative Income Projection
                </h2>
                <p className="text-on-surface-variant text-sm">
                  {YEARS}-year net earnings after training costs
                </p>
              </div>
              <div className="flex gap-2 p-1 bg-surface-container-low rounded-lg">
                <span className="px-3 py-1.5 bg-surface-container-lowest shadow-sm rounded-md text-xs font-bold text-primary">
                  {YEARS} YEARS
                </span>
              </div>
            </div>

            {/* Bar chart — one cluster per pathway */}
            <div className="h-80 w-full bg-surface-container-highest rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 p-6 flex items-end gap-3">
                {pathways.map((p, pi) => {
                  const gains = allGains[pi];
                  return (
                    <div key={p.id} className="flex-1 flex items-end gap-0.5 h-full">
                      {Array.from({ length: YEARS }, (_, yr) => {
                        const val = gains[yr + 1];
                        const pct = maxGain > 0 ? Math.max(2, (val / maxGain) * 100) : 2;
                        return (
                          <div
                            key={yr}
                            title={`Yr ${yr + 1}: ${fmt(val)}`}
                            className={`flex-1 ${CHART_COLORS[pi % CHART_COLORS.length]} rounded-t-sm hover:opacity-80 transition-opacity`}
                            style={{ height: `${pct}%` }}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Year axis labels */}
            <div className="flex justify-between mt-2 px-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                <span key={y} className="text-[10px] text-on-surface-variant font-bold flex-1 text-center">
                  Yr {y}
                </span>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-6">
              {pathways.map((p, pi) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${PATHWAY_COLORS[pi % PATHWAY_COLORS.length]}`} />
                  <span className="text-sm font-semibold text-on-surface">{p.pathName}</span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    ({fmt(p.costBenefit.fiveYearNetGain)} 5-yr gain)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Insights */}
          <div className="lg:col-span-4 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-secondary-container">location_on</span>
                <span className="font-label text-xs font-bold tracking-widest uppercase">
                  Regional Pulse
                </span>
              </div>
              <h3 className="font-headline text-3xl font-bold mb-2">
                Hinds County, MS
              </h3>
              <p className="text-on-primary-container text-sm leading-relaxed mb-8">
                Economic context for the Jackson metro area relative to your target salaries.
              </p>
              <div className="space-y-4">
                <div className="bg-primary-container rounded-lg p-4">
                  <p className="text-[10px] font-bold text-on-primary-fixed-variant uppercase tracking-tighter mb-1">
                    Median Rent vs. Income
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-extrabold">$1,150</span>
                    <span className="text-xs font-bold text-secondary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">trending_down</span>
                      -4% YoY
                    </span>
                  </div>
                </div>
                <div className="bg-primary-container rounded-lg p-4">
                  <p className="text-[10px] font-bold text-on-primary-fixed-variant uppercase tracking-tighter mb-1">
                    Local Job Demand
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-extrabold">High</span>
                    <span className="text-xs font-bold text-on-primary-container italic">
                      Healthcare Leads
                    </span>
                  </div>
                </div>
                <div className="bg-primary-container rounded-lg p-4">
                  <p className="text-[10px] font-bold text-on-primary-fixed-variant uppercase tracking-tighter mb-1">
                    Wage Growth (2yr)
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-extrabold">+8.2%</span>
                    <span className="text-xs font-bold text-secondary-container">
                      All Sectors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Break-Even Analysis */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-8">
            <h3 className="font-headline text-2xl font-bold text-primary mb-8">
              Break-Even Analysis
            </h3>
            <div className="space-y-8">
              {pathways.map((p, pi) => {
                const { breakEvenMonths, totalTrainingCost } = p.costBenefit;
                const breakEvenYears = (breakEvenMonths / 12).toFixed(1);
                const barWidth =
                  breakEvenMonths >= 999
                    ? "95%"
                    : `${Math.min(95, (breakEvenMonths / maxBreakEven) * 100)}%`;
                const fullRoiYear =
                  breakEvenMonths >= 999
                    ? "N/A"
                    : `Full ROI Year ${Math.ceil(breakEvenMonths / 12) + 1}`;

                return (
                  <div key={p.id} className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-lg font-extrabold text-primary">
                        #{pi + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-on-surface">
                          {p.pathName}
                        </span>
                        <span className="text-sm font-black text-primary">
                          {breakEvenMonths >= 999 ? "N/A" : `${breakEvenYears} YEARS`}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                        <div
                          className={`${PATHWAY_COLORS[pi % PATHWAY_COLORS.length]} h-full rounded-full transition-all`}
                          style={{ width: barWidth }}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                          Cost: {fmt(totalTrainingCost)}
                        </span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                          {fullRoiYear}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence + Market cards */}
          <div className="lg:col-span-5 grid grid-rows-2 gap-8">
            {/* Top pathway confidence */}
            <div className="bg-secondary-container text-on-secondary-container rounded-xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="material-symbols-outlined mb-2 text-3xl block">
                    psychology
                  </span>
                  <h4 className="font-headline text-xl font-bold leading-tight">
                    Data Confidence
                  </h4>
                </div>
                <div className="bg-on-secondary-container text-secondary-container px-3 py-1 rounded-full text-xs font-black">
                  {top.salaryRange.confidence.toUpperCase()}
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                <span className="font-bold underline">{top.pathName}</span>
                {" — "}
                {top.salaryRange.confidenceReason} Fit score: {top.fitScore}/100.
              </p>
            </div>

            {/* Second pathway market note */}
            {pathways[1] ? (
              <div className="bg-surface-container-highest border-l-4 border-primary rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-headline text-xl font-bold text-primary mb-2">
                    {pathways[1].pathName}
                  </h4>
                  <p className="text-xs font-medium text-on-surface-variant mb-4 uppercase tracking-wider">
                    {pathways[1].salaryRange.confidence} confidence · {pathways[1].timeToCompletion}
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {pathways[1].fitReason}
                </p>
              </div>
            ) : (
              <div className="bg-surface-container-highest border-l-4 border-primary rounded-xl p-6 flex flex-col justify-between">
                <h4 className="font-headline text-xl font-bold text-primary mb-2">
                  Market Context
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Jackson MSA healthcare and trades sectors show strong demand. Remote work opportunities can expand earnings beyond local averages for tech roles.
                </p>
              </div>
            )}
          </div>

          {/* Side-by-side comparison table */}
          <div className="lg:col-span-12 bg-surface-container-lowest rounded-xl p-8 shadow-sm overflow-x-auto">
            <h3 className="font-headline text-2xl font-bold text-primary mb-6">
              Side-by-Side Comparison
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-3 pr-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Metric
                  </th>
                  {pathways.map((p, pi) => (
                    <th
                      key={p.id}
                      className="text-left py-3 pr-6 font-headline font-bold text-on-surface"
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${PATHWAY_COLORS[pi % PATHWAY_COLORS.length]}`} />
                      {p.pathName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {[
                  {
                    label: "Training Cost",
                    values: pathways.map((p) => fmt(p.costBenefit.totalTrainingCost)),
                  },
                  {
                    label: "Time to Completion",
                    values: pathways.map((p) => p.timeToCompletion),
                  },
                  {
                    label: "First-Year Income",
                    values: pathways.map((p) => fmt(p.costBenefit.firstYearIncome)),
                  },
                  {
                    label: "Median Salary",
                    values: pathways.map((p) => fmt(p.salaryRange.median)),
                  },
                  {
                    label: "Break-Even",
                    values: pathways.map((p) =>
                      p.costBenefit.breakEvenMonths >= 999
                        ? "N/A"
                        : `${p.costBenefit.breakEvenMonths} months`
                    ),
                  },
                  {
                    label: "5-Year Net Gain",
                    values: pathways.map((p) => fmt(p.costBenefit.fiveYearNetGain)),
                  },
                  {
                    label: "Fit Score",
                    values: pathways.map((p) => `${p.fitScore}/100`),
                  },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 pr-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-3 pr-6 font-semibold text-on-surface">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div className="lg:col-span-12">
            <div className="bg-surface-container-lowest rounded-full p-4 flex flex-col md:flex-row items-center justify-between shadow-sm">
              <div className="flex items-center gap-4 pl-6 py-2">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">rocket_launch</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-primary">
                    Ready to take the next step?
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    View your detailed roadmap or explore available resources and grants.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pr-2 mt-4 md:mt-0">
                <Link
                  href="/results"
                  className="px-8 py-3 rounded-full text-sm font-bold text-primary hover:bg-surface-container-low transition-colors"
                >
                  Back to Results
                </Link>
                <Link
                  href="/resources"
                  className="px-8 py-3 editorial-gradient text-on-primary rounded-full text-sm font-bold shadow-lg hover:opacity-90 transition-all"
                >
                  View Resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
