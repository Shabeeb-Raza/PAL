export type PolicyCategory =
  | "graduation"
  | "prerequisite"
  | "attendance"
  | "academic_standing"
  | "course_load"
  | "failed_courses";

export type PolicyType =
  | "min_cgpa"
  | "min_credits"
  | "max_credits"
  | "prerequisite"
  | "attendance_pct"
  | "max_failed"
  | "fyp_required"
  | "semester_limit";

export type PolicySeverity = "fail" | "warning" | "block" | "notify";

export interface Policy {
  id: string;
  name: string;
  category: PolicyCategory;
  type: PolicyType;
  params: Record<string, unknown>;
  severity: PolicySeverity;
  enabled: boolean;
  priority: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PolicyResult {
  policyId: string;
  policyName: string;
  passed: boolean;
  required: string;
  actual: string;
  reason: string;
  severity: PolicySeverity;
}

// Params for each policy type
export interface MinCgpaParams {
  value: number;
}

export interface MinCreditsParams {
  value: number;
}

export interface MaxCreditsParams {
  value: number;
}

export interface PrerequisiteParams {
  course: string;
  requires: string[];
}

export interface AttendancePctParams {
  value: number;
}

export interface MaxFailedParams {
  value: number;
}

export interface FypRequiredParams {
  required: boolean;
}

export interface SemesterLimitParams {
  value: number;
}

// Category metadata for dynamic forms
export interface PolicyCategoryMeta {
  id: PolicyCategory;
  name: string;
  description: string;
  types: PolicyTypeMeta[];
}

export interface PolicyTypeMeta {
  id: PolicyType;
  name: string;
  fields: PolicyField[];
}

export interface PolicyField {
  key: string;
  label: string;
  type: "number" | "text" | "boolean" | "select" | "course";
  required: boolean;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
}
