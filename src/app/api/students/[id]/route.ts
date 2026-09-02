import { NextResponse } from "next/server";
import { RawStudentProfile } from "@/types/student";
import { enrichStudentProfile } from "@/lib/enrichment";
import studentsData from "@/../../data/seed/students.json";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const student = (studentsData as RawStudentProfile[]).find(
    (s) => s.studentId === params.id
  );

  if (!student) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  const enriched = enrichStudentProfile(student);

  return NextResponse.json(enriched);
}
