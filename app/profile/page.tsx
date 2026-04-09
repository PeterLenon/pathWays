/**
 * /profile — Saved Results Dashboard
 *
 * Server Component that reads the user's saved analyses from Supabase and
 * renders them as cards. Redirects to /auth if not signed in.
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createServerClientFromCookies } from "@/lib/supabase-server";
import { PathwayAnalysisResult } from "@/lib/types";

// This page reads cookies and makes live Supabase calls — must never be statically generated.
export const dynamic = "force-dynamic";

interface SavedResult {
  id: string;
  pathway_results: PathwayAnalysisResult;
  pathway_count: number;
  created_at: string;
}

export default async function ProfilePage() {
  const supabase = await createServerClientFromCookies();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: savedResults, error } = await supabase
    .from("saved_results")
    .select("id, pathway_results, pathway_count, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[profile] Supabase query error:", error);
  }

  const results = (savedResults ?? []) as SavedResult[];

  return (
    <>
      <Nav activePage={null} />

      <main className="pt-32 pb-24 min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
              Your Dashboard
            </span>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
                  Saved Analyses
                </h1>
                <p className="text-on-surface-variant mt-2 text-sm">
                  {user.email} &middot; {results.length} saved{" "}
                  {results.length === 1 ? "analysis" : "analyses"}
                </p>
              </div>
              <Link
                href="/assess"
                className="editorial-gradient text-on-primary px-8 py-3 rounded-full font-headline text-sm font-bold tracking-tight hover:opacity-90 transition-all"
              >
                Run New Analysis
              </Link>
            </div>
          </div>

          {/* Results list */}
          {results.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {results.map((result) => (
                <SavedResultCard key={result.id} result={result} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-surface-container-lowest rounded-xl">
      <span className="material-symbols-outlined text-outline text-5xl mb-4 block">
        bookmarks
      </span>
      <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
        No saved analyses yet
      </h2>
      <p className="text-on-surface-variant text-sm mb-6">
        Complete the intake form and save your results to see them here.
      </p>
      <Link
        href="/assess"
        className="editorial-gradient text-on-primary px-8 py-3 rounded-full font-headline text-sm font-bold tracking-tight hover:opacity-90 transition-all"
      >
        Start Career Analysis
      </Link>
    </div>
  );
}

function SavedResultCard({ result }: { result: SavedResult }) {
  const analysis = result.pathway_results;
  const date = new Date(result.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const topPathway = analysis.pathways?.[0];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-label font-semibold text-outline uppercase tracking-widest">
              {date}
            </span>
            <span className="bg-secondary-container/40 text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
              {result.pathway_count || analysis.pathways?.length || 0} Pathways
            </span>
          </div>

          {topPathway && (
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Top Match:{" "}
              <span className="text-primary">{topPathway.pathName}</span>
            </h3>
          )}

          {analysis.summary && (
            <p className="text-on-surface-variant text-sm mt-1 line-clamp-2">
              {analysis.summary}
            </p>
          )}
        </div>

        {/* Pathway stats */}
        {topPathway && (
          <div className="flex gap-4 text-right shrink-0">
            <div>
              <p className="text-xs text-outline font-label uppercase tracking-wider">
                Fit Score
              </p>
              <p className="text-2xl font-headline font-extrabold text-primary">
                {topPathway.fitScore}%
              </p>
            </div>
            <div>
              <p className="text-xs text-outline font-label uppercase tracking-wider">
                Median Salary
              </p>
              <p className="text-2xl font-headline font-extrabold text-secondary">
                ${(topPathway.salaryRange.median / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        )}
      </div>

      {/* All pathways preview */}
      {analysis.pathways?.length > 1 && (
        <div className="mt-4 pt-4 border-t border-surface-container-highest flex gap-3 flex-wrap">
          {analysis.pathways.slice(1).map((p) => (
            <span
              key={p.id}
              className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-xs font-medium"
            >
              {p.pathName}
            </span>
          ))}
        </div>
      )}

      {/* Note: a "Reload" button would re-run the analysis — out of scope for this iteration */}
    </div>
  );
}
