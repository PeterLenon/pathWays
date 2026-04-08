/**
 * Supabase browser client.
 * Use this in Client Components ("use client" files) and browser-side hooks.
 * This file must NOT import from "next/headers" — it runs in the browser.
 */

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createBrowserClient() {
  return createSupabaseBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
