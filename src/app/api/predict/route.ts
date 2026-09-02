import { NextResponse } from "next/server";

interface PredictRequest {
  cgpa: number;
  failedCourses: number;
  attendancePct: number;
  creditsCompleted: number;
  creditsRequired: number;
}

interface PredictResponse {
  riskTier: "Green" | "Amber" | "Red";
  confidence: number;
  explanation: string[];
}

export async function POST(request: Request) {
  try {
    const body: PredictRequest = await request.json();

    const { cgpa, failedCourses, attendancePct, creditsCompleted, creditsRequired } = body;

    if (cgpa < 0 || cgpa > 4) {
      return NextResponse.json({ error: "CGPA must be between 0 and 4" }, { status: 400 });
    }

    const explanation: string[] = [];

    if (cgpa < 2.0) {
      explanation.push(`CGPA ${cgpa} below 2.0 threshold`);
    }
    if (failedCourses > 0) {
      explanation.push(`${failedCourses} failed course${failedCourses > 1 ? "s" : ""}`);
    }
    if (attendancePct < 75) {
      explanation.push(`Attendance ${attendancePct}% below 75%`);
    }
    if (creditsCompleted < creditsRequired * 0.5) {
      explanation.push(`Less than 50% credits completed`);
    }

    let riskTier: "Green" | "Amber" | "Red";
    let confidence: number;

    if (cgpa < 1.5 || failedCourses >= 3) {
      riskTier = "Red";
      confidence = 0.9;
    } else if (cgpa < 2.0 || failedCourses > 0 || attendancePct < 75) {
      riskTier = "Amber";
      confidence = 0.75;
    } else {
      riskTier = "Green";
      confidence = 0.85;
    }

    const response: PredictResponse = {
      riskTier,
      confidence,
      explanation: explanation.length > 0 ? explanation : ["No risk factors detected"],
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
