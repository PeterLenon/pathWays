/**
 * Supabase server client.
 * Use this in Server Components, API Routes, and Server Actions.
 * This file imports from "next/headers" and is therefore server-only.
 */

import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Must be called inside a request context (Server Component, API Route, or
 * Server Action) so that next/headers can access the incoming cookies.
 */
export async function createServerClientFromCookies() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; ignore.
          // The auth middleware handles session refresh for those cases.
        }
      },
    },
  });
}
