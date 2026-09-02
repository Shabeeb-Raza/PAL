"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
  completedCredits: number;
  riskTier: "Green" | "Amber" | "Red";
  attendancePercentage: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (riskFilter) params.set("risk", riskFilter);

    fetch(`/api/students?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      });
  }, [search, riskFilter]);

  const riskOptions = [
    { value: "", label: "All Risk Levels" },
    { value: "Green", label: "Green - Low Risk" },
    { value: "Amber", label: "Amber - Moderate" },
    { value: "Red", label: "Red - High Risk" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage and view all CS students
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={riskOptions}
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            placeholder="Filter by risk"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Semester</TableHead>
              <TableHead className="text-center">CGPA</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead className="text-center">Attendance</TableHead>
              <TableHead className="text-center">Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No students found
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
                    {student.currentSemester}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        student.cgpa >= 2.5
                          ? "text-emerald-600"
                          : student.cgpa >= 2.0
                          ? "text-amber-600"
                          : "text-red-600"
                      }
                    >
                      {student.cgpa.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {student.completedCredits}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        student.attendancePercentage >= 75
                          ? "text-emerald-600"
                          : student.attendancePercentage >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }
                    >
                      {student.attendancePercentage}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        student.riskTier === "Green"
                          ? "green"
                          : student.riskTier === "Amber"
                          ? "amber"
                          : "red"
                      }
                    >
                      {student.riskTier}
                    </Badge>
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
