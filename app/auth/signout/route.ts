/**
 * POST /auth/signout
 *
 * Clears the Supabase session cookie and redirects to the home page.
 * Called via form POST from the Nav sign-out button so that the server
 * re-renders with the cleared session (no client-side flash).
 */

import { NextResponse } from "next/server";
import { createServerClientFromCookies } from "@/lib/supabase-server";

export async function POST() {
  const supabase = await createServerClientFromCookies();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), {
    status: 303, // 303 See Other — correct redirect after POST
  });
}
