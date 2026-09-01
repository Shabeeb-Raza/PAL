export const PAL_CONFIG = {
  program: "BS Computer Science",
  totalCreditsRequired: 130,
  maxCreditsPerSemester: 21,
  minCGPAGraduation: 2.0,
  maxDurationSemesters: 12,
  riskThresholds: {
    green: { minCGPA: 2.5, maxFailedCourses: 0, minAttendance: 75 },
    amber: { minCGPA: 2.0, maxFailedCourses: 2, minAttendance: 60 },
    red: { minCGPA: 0, maxFailedCourses: 3, minAttendance: 0 },
  },
} as const;

export const CORE_COURSES = [
  "CSC101",
  "CSC102",
  "CSC201",
  "CSC202",
  "CSC301",
  "CSC302",
  "CSC401",
  "CSC402",
  "MAT101",
  "MAT102",
  "MAT201",
  "PHY101",
  "PHY102",
] as const;
