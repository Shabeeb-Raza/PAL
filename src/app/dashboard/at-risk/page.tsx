"use client";

import { useEffect, useState } from "react";
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

interface Student {
  studentId: string;
  name: string;
  currentSemester: number;
  cgpa: number;
  riskTier: "Green" | "Amber" | "Red";
  riskExplanation: {
    factors: string[];
  };
}

export default function AtRiskPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students?risk=Red")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">At-Risk Students</h1>
        <p className="text-muted-foreground">
          Students requiring immediate attention
        </p>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardHeader className="flex flex-row items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <CardTitle className="text-base text-red-800">
            {students.length} High Risk Student{students.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">CGPA</TableHead>
              <TableHead className="text-center">Semester</TableHead>
              <TableHead>Risk Factors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No at-risk students
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell className="font-mono text-sm">
                    {student.studentId}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/students/${student.studentId}`}
                      className="font-medium hover:underline"
                    >
                      {student.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-red-600">
                      {student.cgpa.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {student.currentSemester}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.riskExplanation.factors.map((factor, i) => (
                        <Badge key={i} variant="red" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
