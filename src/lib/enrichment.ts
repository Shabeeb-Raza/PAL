import { RawStudentProfile, EnrichedStudentProfile } from "@/types/student";
import { PAL_CONFIG } from "@/config/constants";

export function enrichStudentProfile(
  raw: RawStudentProfile
): EnrichedStudentProfile {
  const riskTier = predictRiskTier(raw);
  const riskExplanation = explainRisk(raw, riskTier);
  const ruleResults = evaluateRules(raw);
  const degreeProgress = (raw.completedCredits / PAL_CONFIG.totalCreditsRequired) * 100;
  const remainingCredits = PAL_CONFIG.totalCreditsRequired - raw.completedCredits;

  return {
    ...raw,
    riskTier,
    riskExplanation,
    ruleResults,
    degreeProgress,
    remainingCredits,
    remainingCourses: [],
    estimatedGraduation: estimateGraduation(raw),
  };
}

function predictRiskTier(raw: RawStudentProfile): "Green" | "Amber" | "Red" {
  const { riskThresholds } = PAL_CONFIG;

  if (
    raw.cgpa < riskThresholds.amber.minCGPA ||
    raw.failedCourses >= riskThresholds.red.maxFailedCourses ||
    raw.attendancePercentage < riskThresholds.amber.minAttendance
  ) {
    return "Red";
  }

  if (
    raw.cgpa < riskThresholds.green.minCGPA ||
    raw.failedCourses >= riskThresholds.green.maxFailedCourses ||
    raw.attendancePercentage < riskThresholds.green.minAttendance
  ) {
    return "Amber";
  }

  return "Green";
}

function explainRisk(
  raw: RawStudentProfile,
  tier: "Green" | "Amber" | "Red"
) {
  const factors: string[] = [];

  if (raw.cgpa < 2.0) factors.push(`CGPA ${raw.cgpa} (below 2.0 threshold)`);
  if (raw.cgpa < 2.5 && raw.cgpa >= 2.0)
    factors.push(`CGPA ${raw.cgpa} (below 2.5 target)`);
  if (raw.failedCourses > 0)
    factors.push(`${raw.failedCourses} failed course(s)`);
  if (raw.attendancePercentage < 75)
    factors.push(`Attendance ${raw.attendancePercentage}%`);
  if (raw.withdrawnCourses > 0)
    factors.push(`${raw.withdrawnCourses} withdrawn course(s)`);

  return {
    factors: factors.length > 0 ? factors : ["No risk factors identified"],
    confidence: tier === "Green" ? 0.9 : tier === "Amber" ? 0.75 : 0.85,
  };
}

function evaluateRules(raw: RawStudentProfile) {
  const rules = [];

  rules.push({
    ruleId: "CGPA-001",
    ruleName: "Minimum CGPA for Graduation",
    passed: raw.cgpa >= PAL_CONFIG.minCGPAGraduation,
    required: String(PAL_CONFIG.minCGPAGraduation),
    actual: String(raw.cgpa),
    reason:
      raw.cgpa >= PAL_CONFIG.minCGPAGraduation
        ? "CGPA meets minimum requirement"
        : `CGPA ${raw.cgpa} is below minimum ${PAL_CONFIG.minCGPAGraduation}`,
  });

  rules.push({
    ruleId: "CREDITS-001",
    ruleName: "Minimum Credits for Graduation",
    passed: raw.completedCredits >= PAL_CONFIG.totalCreditsRequired,
    required: String(PAL_CONFIG.totalCreditsRequired),
    actual: String(raw.completedCredits),
    reason:
      raw.completedCredits >= PAL_CONFIG.totalCreditsRequired
        ? "Credits requirement met"
        : `${PAL_CONFIG.totalCreditsRequired - raw.completedCredits} credits remaining`,
  });

  return rules;
}

function estimateGraduation(raw: RawStudentProfile): string {
  const remainingCredits = PAL_CONFIG.totalCreditsRequired - raw.completedCredits;
  const avgCreditsPerSemester = 15;
  const semestersRemaining = Math.ceil(remainingCredits / avgCreditsPerSemester);
  return `~${semestersRemaining} semester(s)`;
}
