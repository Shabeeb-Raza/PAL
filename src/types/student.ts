export type RiskTier = "Green" | "Amber" | "Red";

export type CourseStatus = "passed" | "failed" | "withdrawn" | "enrolled";

export type ComponentType = "theory" | "lab" | "combined";

export interface Course {
  courseCode: string;
  courseName: string;
  creditHours: number;
  componentType: ComponentType;
  status: CourseStatus;
  grade: string;
  semester: number;
}

export interface SemesterGPA {
  semester: number;
  gpa: number;
  creditsAttempted: number;
  creditsCompleted: number;
}

export interface RawStudentProfile {
  studentId: string;
  name: string;
  program: string;
  admissionSemester: string;
  currentSemester: number;
  cgpa: number;
  semesterGPAs: SemesterGPA[];
  courses: Course[];
  attendancePercentage: number;
  completedCredits: number;
  totalCreditsRequired: number;
  failedCourses: number;
  withdrawnCourses: number;
  academicWarnings: string[];
  fypStatus?: string;
}

export interface RuleResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  required: string;
  actual: string;
  reason: string;
}

export interface RiskExplanation {
  factors: string[];
  confidence: number;
}

export interface EnrichedStudentProfile extends RawStudentProfile {
  riskTier: RiskTier;
  riskExplanation: RiskExplanation;
  ruleResults: RuleResult[];
  degreeProgress: number;
  remainingCredits: number;
  remainingCourses: string[];
  estimatedGraduation: string;
}
