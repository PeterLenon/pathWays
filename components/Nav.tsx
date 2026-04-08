"use client";

/**
 * Site-wide navigation bar. Client Component.
 *
 * Reads auth state client-side via Supabase's browser client so that any page
 * (Server or Client Component) can import Nav without violating the
 * "Server Component cannot be imported by Client Component" rule.
 *
 * Auth state is checked once on mount; the nav re-renders when the user signs
 * in or out. A brief "not signed in" flash on first load is acceptable for MVP.
 *
 * Active link is determined from the pathname via usePathname() — no prop needed.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase-browser";

interface NavProps {
  /** Optional override for active page detection (useful in tests or storybook). */
  activePage?: "optimizer" | "roadmaps" | "roi" | "resources" | null;
}

const navLinks = [
  { label: "Optimizer", href: "/assess", segment: "/assess" },
  { label: "Roadmaps", href: "/results", segment: "/results" },
  { label: "ROI Analysis", href: "/roi", segment: "/roi" },
  { label: "Resources", href: "/resources", segment: "/resources" },
];

export default function Nav({ activePage }: NavProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();

    // Fetch current session once on mount
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    // Keep auth state in sync with sign-in/sign-out events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function isActive(segment: string): boolean {
    if (activePage !== undefined) {
      // Explicit override (e.g. the welcome page passes activePage=null explicitly)
      return false;
    }
    return pathname.startsWith(segment);
  }

  const initials = userEmail ? userEmail[0].toUpperCase() : null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-blue-950 font-headline"
        >
          IncomePath
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = activePage !== undefined ? false : isActive(link.segment);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-headline text-sm font-semibold tracking-tight pb-1 transition-colors ${
                  active
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 font-headline text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                  {initials}
                </span>
                <span className="hidden lg:inline">My Results</span>
              </Link>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="font-headline text-sm font-semibold text-slate-500 hover:text-primary transition-colors px-3 py-1"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="font-headline text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/assess"
                className="editorial-gradient text-on-primary px-6 py-2.5 rounded-full font-headline text-sm font-bold tracking-tight shadow-md hover:opacity-90 active:opacity-80 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
