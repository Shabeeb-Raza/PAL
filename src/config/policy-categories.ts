import { PolicyCategoryMeta } from "@/types/policy";

export const POLICY_CATEGORIES: PolicyCategoryMeta[] = [
  {
    id: "graduation",
    name: "Graduation Requirements",
    description: "Requirements for degree completion",
    types: [
      {
        id: "min_cgpa",
        name: "Minimum CGPA",
        fields: [
          {
            key: "value",
            label: "Required CGPA",
            type: "number",
            required: true,
            defaultValue: 2.0,
          },
        ],
      },
      {
        id: "min_credits",
        name: "Minimum Credits",
        fields: [
          {
            key: "value",
            label: "Required Credits",
            type: "number",
            required: true,
            defaultValue: 130,
          },
        ],
      },
      {
        id: "fyp_required",
        name: "Final Year Project",
        fields: [
          {
            key: "required",
            label: "FYP Required",
            type: "boolean",
            required: true,
            defaultValue: true,
          },
        ],
      },
    ],
  },
  {
    id: "prerequisite",
    name: "Course Prerequisites",
    description: "Required courses before enrollment",
    types: [
      {
        id: "prerequisite",
        name: "Prerequisite Rule",
        fields: [
          {
            key: "course",
            label: "Target Course",
            type: "course",
            required: true,
          },
          {
            key: "requires",
            label: "Required Courses (comma-separated)",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "attendance",
    name: "Attendance Policies",
    description: "Attendance requirements",
    types: [
      {
        id: "attendance_pct",
        name: "Minimum Attendance %",
        fields: [
          {
            key: "value",
            label: "Minimum Percentage",
            type: "number",
            required: true,
            defaultValue: 75,
          },
        ],
      },
    ],
  },
  {
    id: "academic_standing",
    name: "Academic Standing",
    description: "Warning, probation, and dismissal rules",
    types: [
      {
        id: "max_failed",
        name: "Maximum Failed Courses",
        fields: [
          {
            key: "value",
            label: "Max Failed Courses",
            type: "number",
            required: true,
            defaultValue: 3,
          },
        ],
      },
      {
        id: "min_cgpa",
        name: "Minimum CGPA",
        fields: [
          {
            key: "value",
            label: "Required CGPA",
            type: "number",
            required: true,
            defaultValue: 2.0,
          },
        ],
      },
    ],
  },
  {
    id: "course_load",
    name: "Course Load",
    description: "Credit hour limits per semester",
    types: [
      {
        id: "max_credits",
        name: "Maximum Credits per Semester",
        fields: [
          {
            key: "value",
            label: "Max Credits",
            type: "number",
            required: true,
            defaultValue: 21,
          },
        ],
      },
    ],
  },
  {
    id: "failed_courses",
    name: "Failed Courses",
    description: "Rules for failed course limits",
    types: [
      {
        id: "max_failed",
        name: "Maximum Failed Courses",
        fields: [
          {
            key: "value",
            label: "Max Failed Courses",
            type: "number",
            required: true,
            defaultValue: 3,
          },
        ],
      },
    ],
  },
];
