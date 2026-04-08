import { NextRequest, NextResponse } from "next/server";
import { UserProfile, PathwayAnalysisResult } from "@/lib/types";
import { runAnalysisPipeline } from "@/lib/pipeline";

export async function POST(request: NextRequest) {
  let userProfile: UserProfile;

  try {
    const body = await request.json();
    userProfile = body.userProfile as UserProfile;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!userProfile) {
    return NextResponse.json({ error: "userProfile is required" }, { status: 400 });
  }

  try {
    const result: PathwayAnalysisResult = await runAnalysisPipeline(userProfile);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[api/analyze] Pipeline error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
