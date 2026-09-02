"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalStudents: number;
  riskDistribution: {
    green: number;
    amber: number;
    red: number;
  };
  averageCGPA: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        const students = data.students || [];
        const riskDistribution = {
          green: students.filter((s: any) => s.riskTier === "Green").length,
          amber: students.filter((s: any) => s.riskTier === "Amber").length,
          red: students.filter((s: any) => s.riskTier === "Red").length,
        };
        const averageCGPA =
          students.reduce((sum: number, s: any) => sum + s.cgpa, 0) /
            students.length || 0;

        setStats({
          totalStudents: students.length,
          riskDistribution,
          averageCGPA: Math.round(averageCGPA * 100) / 100,
        });
      });
  }, []);

  if (!stats) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Student advisory overview for CS department
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <span className="text-muted-foreground">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active advisees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average CGPA
            </CardTitle>
            <span className="text-muted-foreground">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCGPA}</div>
            <p className="text-xs text-muted-foreground">
              Department average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <span className="text-red-500">⚠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.riskDistribution.red}
            </div>
            <p className="text-xs text-muted-foreground">
              High risk students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On Track
            </CardTitle>
            <span className="text-emerald-500">🎓</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.riskDistribution.green}
            </div>
            <p className="text-xs text-muted-foreground">
              Low risk students
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="green">Green</Badge>
                  <span className="text-sm text-muted-foreground">Low risk</span>
                </div>
                <span className="font-medium">{stats.riskDistribution.green}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="amber">Amber</Badge>
                  <span className="text-sm text-muted-foreground">Moderate</span>
                </div>
                <span className="font-medium">{stats.riskDistribution.amber}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="red">Red</Badge>
                  <span className="text-sm text-muted-foreground">High risk</span>
                </div>
                <span className="font-medium">{stats.riskDistribution.red}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/dashboard/students"
                className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted transition-colors"
              >
                <span>View all students</span>
                <span className="text-muted-foreground">→</span>
              </a>
              <a
                href="/dashboard/at-risk"
                className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted transition-colors"
              >
                <span>At-risk students</span>
                <span className="text-muted-foreground">→</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
