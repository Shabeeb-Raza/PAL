import { RawStudentProfile, RuleResult } from "@/types/student";
import { Policy, PolicyResult, PolicySeverity } from "@/types/policy";

/**
 * Generic rule engine - evaluates policies against student profiles.
 * No knowledge of categories, just evaluates conditions.
 */
export function evaluatePolicies(
  student: RawStudentProfile,
  policies: Policy[]
): PolicyResult[] {
  return policies
    .filter((p) => p.enabled)
    .sort((a, b) => b.priority - a.priority)
    .map((policy) => evaluatePolicy(student, policy));
}

function evaluatePolicy(
  student: RawStudentProfile,
  policy: Policy
): PolicyResult {
  const evaluator = evaluators[policy.type];

  if (!evaluator) {
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed: false,
      required: "N/A",
      actual: "N/A",
      reason: `Unknown policy type: ${policy.type}`,
      severity: policy.severity,
    };
  }

  return evaluator(student, policy);
}

// Generic evaluators - one per policy type
const evaluators: Record<
  string,
  (student: RawStudentProfile, policy: Policy) => PolicyResult
> = {
  min_cgpa: (student, policy) => {
    const threshold = policy.params.value as number;
    const passed = student.cgpa >= threshold;
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed,
      required: `${threshold}`,
      actual: `${student.cgpa}`,
      reason: passed
        ? `CGPA ${student.cgpa} meets minimum ${threshold}`
        : `CGPA ${student.cgpa} is below minimum ${threshold}`,
      severity: policy.severity,
    };
  },

  min_credits: (student, policy) => {
    const threshold = policy.params.value as number;
    const passed = student.completedCredits >= threshold;
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed,
      required: `${threshold}`,
      actual: `${student.completedCredits}`,
      reason: passed
        ? `Credits ${student.completedCredits} meets minimum ${threshold}`
        : `${threshold - student.completedCredits} credits remaining`,
      severity: policy.severity,
    };
  },

  max_credits: (student, policy) => {
    const max = policy.params.value as number;
    const current = student.courses
      .filter((c) => c.status === "enrolled")
      .reduce((sum, c) => sum + c.creditHours, 0);
    const passed = current <= max;
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed,
      required: `Max ${max}`,
      actual: `${current}`,
      reason: passed
        ? `Current load ${current} within limit ${max}`
        : `Current load ${current} exceeds max ${max}`,
      severity: policy.severity,
    };
  },

  attendance_pct: (student, policy) => {
    const threshold = policy.params.value as number;
    const passed = student.attendancePercentage >= threshold;
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed,
      required: `${threshold}%`,
      actual: `${student.attendancePercentage}%`,
      reason: passed
        ? `Attendance ${student.attendancePercentage}% meets minimum ${threshold}%`
        : `Attendance ${student.attendancePercentage}% is below minimum ${threshold}%`,
      severity: policy.severity,
    };
  },

  max_failed: (student, policy) => {
    const max = policy.params.value as number;
    const passed = student.failedCourses <= max;
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed,
      required: `Max ${max}`,
      actual: `${student.failedCourses}`,
      reason: passed
        ? `${student.failedCourses} failed course(s) within limit ${max}`
        : `${student.failedCourses} failed course(s) exceeds limit ${max}`,
      severity: policy.severity,
    };
  },

  fyp_required: (student, policy) => {
    const required = policy.params.required as boolean;
    if (!required) {
      return {
        policyId: policy.id,
        policyName: policy.name,
        passed: true,
        required: "No",
        actual: "N/A",
        reason: "FYP not required",
        severity: policy.severity,
      };
    }
    const fypCompleted = student.fypStatus === "completed";
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed: fypCompleted,
      required: "Completed",
      actual: student.fypStatus || "Not started",
      reason: fypCompleted
        ? "FYP completed"
        : "FYP not yet completed",
      severity: policy.severity,
    };
  },

  semester_limit: (student, policy) => {
    const max = policy.params.value as number;
    const passed = student.currentSemester <= max;
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed,
      required: `Max ${max} semesters`,
      actual: `Semester ${student.currentSemester}`,
      reason: passed
        ? `Currently in semester ${student.currentSemester}, within limit ${max}`
        : `Currently in semester ${student.currentSemester}, exceeded limit ${max}`,
      severity: policy.severity,
    };
  },

  prerequisite: (student, policy) => {
    const { course, requires } = policy.params as {
      course: string;
      requires: string[];
    };
    const completedCourses = student.courses
      .filter((c) => c.status === "passed")
      .map((c) => c.courseCode);
    const missing = requires.filter((r) => !completedCourses.includes(r));
    const passed = missing.length === 0;
    return {
      policyId: policy.id,
      policyName: policy.name,
      passed,
      required: `Requires: ${requires.join(", ")}`,
      actual: passed ? "All completed" : `Missing: ${missing.join(", ")}`,
      reason: passed
        ? `Prerequisites for ${course} met`
        : `Missing prerequisites for ${course}: ${missing.join(", ")}`,
      severity: policy.severity,
    };
  },
};

/**
 * Convert Policy[] to RuleResult[] for backward compatibility
 */
export function policiesToRuleResults(results: PolicyResult[]): RuleResult[] {
  return results.map((r) => ({
    ruleId: r.policyId,
    ruleName: r.policyName,
    passed: r.passed,
    required: r.required,
    actual: r.actual,
    reason: r.reason,
  }));
}
