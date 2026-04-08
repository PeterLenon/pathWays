"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CareerPathway, PathwayAnalysisResult } from "@/lib/types";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pathway, setPathway] = useState<CareerPathway | null>(null);
  const [allPathways, setAllPathways] = useState<CareerPathway[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("pathwayResults");
    if (!raw) {
      router.replace("/assess");
      return;
    }
    try {
      const result: PathwayAnalysisResult = JSON.parse(raw);
      setAllPathways(result.pathways);
      const found = result.pathways.find((p) => p.id === params.id);
      if (!found) {
        router.replace("/results");
        return;
      }
      setPathway(found);
    } catch {
      router.replace("/results");
    }
  }, [params.id, router]);

  if (!pathway) {
    return (
      <>
        <Nav activePage="roadmaps" />
        <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container rounded-full">
            <svg className="animate-spin w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium text-on-surface-variant">Loading roadmap…</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const rankIndex = allPathways.findIndex((p) => p.id === pathway.id);

  return (
    <>
      <Nav activePage="roadmaps" />

      <main className="pt-24 pb-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-8">
          {/* Breadcrumb */}
          <header className="mb-12 mt-10">
            <Link
              href="/results"
              className="flex items-center gap-2 text-primary mb-4 opacity-70 hover:opacity-100 transition-opacity w-fit"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="text-xs font-label font-bold tracking-widest uppercase">
                Back to explore
              </span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h1 className="text-5xl font-extrabold tracking-tighter text-primary mb-4 font-headline">
                  {pathway.pathName}
                </h1>
                <p className="text-xl text-on-surface-variant font-body leading-relaxed">
                  {pathway.description}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="p-4 bg-secondary-container rounded-xl flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-xs font-label font-bold text-on-secondary-container tracking-tighter uppercase">
                    Fit Score
                  </span>
                  <span className="text-2xl font-headline font-extrabold text-on-secondary-container">
                    {pathway.fitScore}%
                  </span>
                </div>
                <div className="p-4 bg-surface-container-high rounded-xl flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-xs font-label font-bold text-primary tracking-tighter uppercase">
                    Salary Range
                  </span>
                  <span className="text-lg font-headline font-extrabold text-primary">
                    {fmt(pathway.salaryRange.median)}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Roadmap steps */}
            <section className="lg:col-span-7 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-primary font-headline">
                  Strategic Execution Roadmap
                </h2>
                <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold">
                  {pathway.timeToCompletion.toUpperCase()}
                </span>
              </div>

              <div className="relative space-y-12 pl-4">
                {pathway.nextSteps.map((step, index) => {
                  const isFirst = index === 0;
                  const isLast = index === pathway.nextSteps.length - 1;
                  return (
                    <div key={step.order} className="relative flex gap-8">
                      {/* Roadmap connector line */}
                      {!isLast && (
                        <div className="absolute left-[22px] top-12 h-full w-0.5 roadmap-line" />
                      )}
                      {/* Step circle */}
                      <div
                        className={`z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm ${
                          isFirst
                            ? "editorial-gradient text-white"
                            : "bg-surface-container-highest border-2 border-primary-container text-primary"
                        }`}
                      >
                        {step.order}
                      </div>
                      {/* Step card */}
                      <div className="bg-surface-container-lowest p-8 rounded-xl flex-grow shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-primary font-headline">
                            {step.action}
                          </h3>
                          <span className="text-xs font-bold text-secondary flex items-center gap-1 flex-shrink-0 ml-4">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {step.timeframe.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-on-surface-variant mb-4 leading-relaxed text-sm">
                          {step.details}
                        </p>
                        {step.cost > 0 && (
                          <span className="px-3 py-1 bg-surface-container text-primary text-xs font-semibold rounded-lg">
                            Est. cost: {fmt(step.cost)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Barriers & Supports */}
              {(pathway.barriers.length > 0 || pathway.supports.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pathway.barriers.length > 0 && (
                    <div className="bg-surface-container-low p-6 rounded-xl">
                      <h4 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-outline">warning</span>
                        Challenges to Know
                      </h4>
                      <ul className="space-y-2">
                        {pathway.barriers.map((b, i) => (
                          <li key={i} className="flex gap-2 text-sm text-on-surface-variant">
                            <span className="text-outline flex-shrink-0 mt-0.5">⚠</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pathway.supports.length > 0 && (
                    <div className="bg-secondary-container/20 p-6 rounded-xl">
                      <h4 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                        Support Available
                      </h4>
                      <ul className="space-y-2">
                        {pathway.supports.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-on-surface-variant">
                            <span className="text-secondary flex-shrink-0 mt-0.5">✓</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Right: AI Insights & Resources */}
            <aside className="lg:col-span-5 space-y-8">
              {/* AI Insights */}
              <div className="bg-surface-container-high rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                </div>
                <h3 className="text-xs font-label font-bold tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  AI PATHWAY INSIGHTS
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-primary mb-1 text-sm">Why this fits you</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {pathway.fitReason}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/50 rounded-lg">
                      <span className="text-2xl font-bold text-secondary block">
                        {pathway.fitScore}%
                      </span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                        Fit Match
                      </p>
                    </div>
                    <div className="p-4 bg-white/50 rounded-lg">
                      <span className="text-2xl font-bold text-primary block">
                        {pathway.costBenefit.breakEvenMonths >= 999
                          ? "N/A"
                          : `${pathway.costBenefit.breakEvenMonths}mo`}
                      </span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                        Break-Even
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/50 rounded-lg">
                      <span className="text-2xl font-bold text-primary block">
                        {fmt(pathway.salaryRange.low)}
                      </span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                        Starting Salary
                      </p>
                    </div>
                    <div className="p-4 bg-white/50 rounded-lg">
                      <span className="text-2xl font-bold text-secondary block">
                        {fmt(pathway.costBenefit.fiveYearNetGain)}
                      </span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                        5-Year Net Gain
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Programs */}
              {pathway.programOptions.length > 0 && (
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-primary mb-6 font-headline">
                    Local Training Programs
                  </h3>
                  <div className="space-y-3">
                    {pathway.programOptions.map((prog, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-container-high transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm">school</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{prog.name}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase font-semibold">
                              {prog.institution} — {prog.location}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {fmt(prog.estimatedCost)} · {prog.duration}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-primary text-sm flex-shrink-0">
                          arrow_forward
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/resources"
                    className="block mt-6 text-center py-3 px-6 border border-primary text-primary rounded-full font-bold text-sm hover:bg-primary hover:text-on-primary transition-all"
                  >
                    View All Resources &amp; Grants
                  </Link>
                </div>
              )}

              {/* Other Pathways */}
              {allPathways.filter((p) => p.id !== pathway.id).length > 0 && (
                <div className="bg-surface-container-low p-6 rounded-xl">
                  <h4 className="font-headline font-bold text-on-surface mb-4 text-sm">
                    Other Pathways for You
                  </h4>
                  <div className="space-y-2">
                    {allPathways
                      .filter((p) => p.id !== pathway.id)
                      .slice(0, 3)
                      .map((p) => (
                        <Link
                          key={p.id}
                          href={`/results/${p.id}`}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors"
                        >
                          <span className="text-sm font-medium text-on-surface">
                            {p.pathName}
                          </span>
                          <span className="text-xs text-secondary font-bold">
                            {p.fitScore}%
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
