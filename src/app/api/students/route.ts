import { NextResponse } from "next/server";
import { RawStudentProfile } from "@/types/student";
import { enrichStudentProfile } from "@/lib/enrichment";
import studentsData from "@/../../data/seed/students.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.toLowerCase() || "";
  const risk = searchParams.get("risk") || "";
  const sort = searchParams.get("sort") || "studentId";
  const order = searchParams.get("order") || "asc";

  let students = (studentsData as RawStudentProfile[]).map(enrichStudentProfile);

  if (search) {
    students = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.studentId.toLowerCase().includes(search)
    );
  }

  if (risk) {
    students = students.filter((s) => s.riskTier === risk);
  }

  students.sort((a, b) => {
    const aVal = a[sort as keyof typeof a];
    const bVal = b[sort as keyof typeof b];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  return NextResponse.json({
    count: students.length,
    students,
  });
}
