"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PathwayAnalysisResult } from "@/lib/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/results/DisclaimerBanner";
import PathwayCard from "@/components/results/PathwayCard";
import LoadingPathways from "@/components/results/LoadingPathways";
import { createBrowserClient } from "@/lib/supabase-browser";

// sessionStorage is not available during SSR — disable static pre-rendering.
export const dynamic = "force-dynamic";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function ResultsPage() {
  const [result, setResult] = useState<PathwayAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("pathwayResults");
    if (!raw) {
      router.replace("/assess");
      return;
    }
    try {
      setResult(JSON.parse(raw));
    } catch {
      setError("Failed to load your results. Please try again.");
    }
  }, [router]);

  async function handleSaveResults() {
    if (!result) return;
    setSaveStatus("saving");

    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Not signed in — send them to auth with a return hint
      router.push("/auth");
      return;
    }

    const { error: dbError } = await supabase.from("saved_results").insert({
      user_id: user.id,
      pathway_results: result,
      pathway_count: result.pathways.length,
    });

    if (dbError) {
      console.error("[results] Save error:", dbError);
      setSaveStatus("error");
    } else {
      setSaveStatus("saved");
    }
  }

  if (error) {
    return (
      <>
        <Nav activePage="roadmaps" />
        <main className="min-h-screen bg-background flex items-center justify-center px-4 pt-24">
          <div className="text-center">
            <p className="text-error mb-4">{error}</p>
            <Link
              href="/assess"
              className="text-primary font-semibold underline text-sm"
            >
              Start over
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!result) {
    return (
      <>
        <Nav activePage="roadmaps" />
        <main className="min-h-screen bg-background pt-24">
          <LoadingPathways />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav activePage="roadmaps" />

      <main className="pt-24 pb-16 min-h-screen bg-background">
        {/* Editorial header */}
        <header className="max-w-7xl mx-auto px-8 pt-10 pb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4">
            Career Optimization Engine
          </div>
          <h1 className="text-5xl font-extrabold font-headline text-on-surface tracking-tighter leading-none mb-4">
            The Path to Your{" "}
            <span className="text-primary">Maximum Potential</span>.
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-medium">
            {result.summary}
          </p>

          {/* Save Results CTA */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSaveResults}
              disabled={saveStatus === "saving" || saveStatus === "saved"}
              className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-headline text-sm font-bold hover:opacity-90 active:opacity-80 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">
                {saveStatus === "saved" ? "check_circle" : "bookmark_add"}
              </span>
              {saveStatus === "saving"
                ? "Saving…"
                : saveStatus === "saved"
                ? "Saved to Profile"
                : "Save Results"}
            </button>
            {saveStatus === "error" && (
              <span className="text-sm text-error font-medium">
                Save failed — please try again.
              </span>
            )}
          </div>
        </header>

        {/* Main grid */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Pathway cards */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-headline tracking-tight">
                  Your AI Recommendations
                </h2>
                <span className="text-xs text-on-surface-variant font-label">
                  {result.pathways.length} pathways found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.pathways.map((pathway, i) => (
                  <PathwayCard key={pathway.id} pathway={pathway} rank={i + 1} />
                ))}
              </div>

              <DisclaimerBanner counselorNote={result.counselorNote} />

              <div className="text-center pb-4">
                <Link
                  href="/assess"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors underline"
                >
                  Start over with different answers
                </Link>
              </div>
            </div>

            {/* RIGHT: Analytics sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* ROI snapshot */}
              <div className="bg-surface-container-highest rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold font-headline mb-6 text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">analytics</span>
                  ROI Snapshot
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Top Path Income Gain
                      </span>
                      {result.pathways[0] && (
                        <span className="text-sm font-bold text-secondary">
                          +
                          {Math.round(
                            ((result.pathways[0].costBenefit.firstYearIncome -
                              result.pathways[0].costBenefit.currentAnnualIncome) /
                              result.pathways[0].costBenefit.currentAnnualIncome) *
                              100
                          )}
                          %
                        </span>
                      )}
                    </div>
                    <div className="h-28 flex items-end gap-2 bg-surface-container-low/50 rounded-xl p-4">
                      {result.pathways.slice(0, 4).map((p, i) => {
                        const heights = ["h-1/4", "h-2/4", "h-3/4", "h-full"];
                        return (
                          <div
                            key={p.id}
                            className={`flex-1 bg-primary/${20 + i * 20} rounded-t-sm ${heights[i]}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {result.pathways[0] && (
                    <div className="bg-surface-container-lowest/50 rounded-xl p-4">
                      <h4 className="text-sm font-bold mb-3">
                        Top Path: {result.pathways[0].pathName}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="text-[10px] text-on-surface-variant font-bold uppercase">
                              Training Cost
                            </div>
                            <div className="text-sm font-bold">
                              ${result.pathways[0].estimatedCost.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="text-[10px] text-on-surface-variant font-bold uppercase">
                              Break-even
                            </div>
                            <div className="text-sm font-bold">
                              {result.pathways[0].costBenefit.breakEvenMonths >= 999
                                ? "N/A"
                                : `${result.pathways[0].costBenefit.breakEvenMonths} months`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison desk */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl">
                    compare_arrows
                  </span>
                </div>
                <h3 className="text-lg font-bold font-headline mb-4 relative z-10">
                  Your Pathways
                </h3>
                <div className="space-y-3 relative z-10">
                  {result.pathways.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      href={`/results/${p.id}`}
                      className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary text-sm">
                        check_circle
                      </span>
                      <div className="flex-grow min-w-0">
                        <div className="text-xs font-bold truncate">{p.pathName}</div>
                        <div className="text-[10px] text-on-surface-variant">
                          {p.timeToCompletion}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline text-sm flex-shrink-0">
                        arrow_forward_ios
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ROI analysis CTA */}
              <Link
                href="/roi"
                className="block bg-primary text-on-primary rounded-xl p-6 group"
              >
                <span className="material-symbols-outlined text-3xl mb-4 block">
                  trending_up
                </span>
                <h3 className="font-headline text-lg font-bold mb-2">
                  Deep ROI Analysis
                </h3>
                <p className="text-on-primary-container text-sm mb-4 opacity-80">
                  Compare your pathways side-by-side with break-even charts and
                  10-year income projections.
                </p>
                <span className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Analysis
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
