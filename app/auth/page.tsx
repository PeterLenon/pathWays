"use client";

/**
 * Sign In / Sign Up page.
 *
 * Single form that toggles between "sign in" and "sign up" mode.
 * Uses Supabase's email+password auth. After sign-in, redirects to /profile.
 * After sign-up, shows a "check your email" confirmation message.
 */

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase-browser";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Mode = "signin" | "signup";

// Supabase auth requires the client environment — disable static pre-rendering.
export const dynamic = "force-dynamic";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    // Create the client here (inside the handler) so it's never called during SSR.
    const supabase = createBrowserClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // After email confirmation, redirect back to the app
          emailRedirectTo: `${window.location.origin}/profile`,
        },
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
      } else {
        setStatus("success");
        setMessage(
          "Account created! Check your email to confirm your address, then sign in."
        );
      }
      return;
    }

    // Sign in (supabase is created above)
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      // Reload the page so the server component (Nav) re-reads the session cookie
      window.location.href = "/profile";
    }
  }

  const isLoading = status === "loading";

  return (
    <>
      <Nav activePage={null} />

      <main className="min-h-screen bg-background flex items-center justify-center pt-24 pb-16 px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
              Your Account
            </span>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
              {mode === "signin" ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="text-on-surface-variant text-sm mt-2">
              {mode === "signin"
                ? "Sign in to access your saved career analysis results."
                : "Save and revisit your personalized career pathways anytime."}
            </p>
          </div>

          {/* Card */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            {status === "success" ? (
              <div className="text-center space-y-4">
                <span className="material-symbols-outlined text-secondary text-5xl">
                  mark_email_read
                </span>
                <p className="font-headline font-bold text-on-surface">{message}</p>
                <button
                  onClick={() => {
                    setMode("signin");
                    setStatus("idle");
                    setMessage("");
                  }}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-label font-semibold text-outline uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="w-full bg-surface-container-low rounded-xl p-4 text-on-surface placeholder-outline/50 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label font-semibold text-outline uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                    disabled={isLoading}
                    className="w-full bg-surface-container-low rounded-xl p-4 text-on-surface placeholder-outline/50 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {status === "error" && (
                  <div className="bg-error-container text-on-error-container rounded-xl p-4 text-sm font-medium">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full editorial-gradient text-on-primary py-4 rounded-full font-headline font-bold text-base hover:opacity-90 active:opacity-80 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">
                        progress_activity
                      </span>
                      {mode === "signin" ? "Signing In…" : "Creating Account…"}
                    </>
                  ) : mode === "signin" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setStatus("idle");
                      setMessage("");
                    }}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {mode === "signin" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <span className="font-semibold text-primary">Sign Up</span>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <span className="font-semibold text-primary">Sign In</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-outline mt-6">
            By creating an account you agree to our{" "}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            . Your career data is private and never sold.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
