"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StudentDetail {
  studentId: string;
  name: string;
  program: string;
  admissionSemester: string;
  currentSemester: number;
  cgpa: number;
  semesterGPAs: Array<{
    semester: number;
    gpa: number;
    creditsAttempted: number;
    creditsCompleted: number;
  }>;
  courses: Array<{
    courseCode: string;
    courseName: string;
    creditHours: number;
    status: string;
    grade: string;
    semester: number;
  }>;
  attendancePercentage: number;
  completedCredits: number;
  totalCreditsRequired: number;
  failedCourses: number;
  withdrawnCourses: number;
  academicWarnings: string[];
  riskTier: "Green" | "Amber" | "Red";
  riskExplanation: {
    factors: string[];
    confidence: number;
  };
  ruleResults: Array<{
    ruleId: string;
    ruleName: string;
    passed: boolean;
    required: string;
    actual: string;
    reason: string;
  }>;
  degreeProgress: number;
  remainingCredits: number;
  estimatedGraduation: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/students/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setStudent(data);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  if (!student) {
    return <div className="text-muted-foreground">Student not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/students"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to students
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
          <p className="text-muted-foreground">
            {student.studentId} · {student.program}
          </p>
        </div>
        <Badge
          variant={
            student.riskTier === "Green"
              ? "green"
              : student.riskTier === "Amber"
              ? "amber"
              : "red"
          }
          className="text-sm"
        >
          {student.riskTier} Risk
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.cgpa.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.currentSemester}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {student.attendancePercentage}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {student.degreeProgress.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {student.remainingCredits} credits remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.riskExplanation.factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>{factor}</span>
              </div>
            ))}
            <div className="pt-2 text-xs text-muted-foreground">
              Confidence: {(student.riskExplanation.confidence * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Graduation Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.ruleResults.map((rule) => (
              <div key={rule.ruleId} className="flex items-start gap-2 text-sm">
                <span className={rule.passed ? "text-emerald-500" : "text-red-500"}>
                  {rule.passed ? "✓" : "✗"}
                </span>
                <div>
                  <div className="font-medium">{rule.ruleName}</div>
                  <div className="text-muted-foreground">{rule.reason}</div>
                </div>
              </div>
            ))}
            <div className="pt-2 text-xs text-muted-foreground">
              Estimated graduation: {student.estimatedGraduation}
            </div>
          </CardContent>
        </Card>
      </div>

      {student.academicWarnings.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-base text-amber-800">
              Academic Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.academicWarnings.map((warning, i) => (
              <div key={i} className="text-sm text-amber-700">
                {warning}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-center">Semester</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.courses.map((course, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm">
                    {course.courseCode}
                  </TableCell>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell className="text-center">
                    {course.creditHours}
                  </TableCell>
                  <TableCell className="text-center">{course.semester}</TableCell>
                  <TableCell className="text-center font-medium">
                    {course.grade}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        course.status === "passed"
                          ? "green"
                          : course.status === "failed"
                          ? "red"
                          : course.status === "withdrawn"
                          ? "amber"
                          : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Semester GPA History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Semester</TableHead>
                <TableHead className="text-center">GPA</TableHead>
                <TableHead className="text-center">Attempted</TableHead>
                <TableHead className="text-center">Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.semesterGPAs.map((sem) => (
                <TableRow key={sem.semester}>
                  <TableCell className="text-center">{sem.semester}</TableCell>
                  <TableCell className="text-center font-medium">
                    {sem.gpa.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {sem.creditsAttempted}
                  </TableCell>
                  <TableCell className="text-center">
                    {sem.creditsCompleted}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
