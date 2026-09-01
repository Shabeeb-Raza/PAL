import { NextResponse } from "next/server";
import { RawStudentProfile } from "@/types/student";
import { enrichStudentProfile } from "@/lib/enrichment";

export async function POST(request: Request) {
  try {
    const profile: RawStudentProfile = await request.json();
    const enriched = enrichStudentProfile(profile);

    return NextResponse.json({
      studentId: enriched.studentId,
      ruleResults: enriched.ruleResults,
      riskTier: enriched.riskTier,
      riskExplanation: enriched.riskExplanation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to evaluate rules" },
      { status: 400 }
    );
  }
}
