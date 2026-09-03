import "dotenv/config";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to database");

  // Create courses
  const courses = [
    ["CS101", "Introduction to Programming", 3, "theory"],
    ["CS101L", "Programming Lab", 1, "lab"],
    ["CS201", "Data Structures", 3, "theory"],
    ["CS201L", "Data Structures Lab", 1, "lab"],
    ["CS301", "Database Systems", 3, "theory"],
    ["CS301L", "Database Systems Lab", 1, "lab"],
    ["CS401", "Software Engineering", 3, "theory"],
    ["CS401L", "Software Engineering Lab", 1, "lab"],
    ["MATH101", "Calculus I", 3, "combined"],
    ["MATH201", "Linear Algebra", 3, "combined"],
  ];

  for (const [code, name, credits, component] of courses) {
    await client.query(
      `INSERT INTO "Course" (id, code, name, "creditHours", "componentType", program)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'CS')
       ON CONFLICT (code) DO NOTHING`,
      [code, name, credits, component]
    );
  }
  console.log("Created courses");

  // Create students
  const students = [
    ["CS-2021-001", "Ahmed Khan", 3.2, 95, 6, "active"],
    ["CS-2021-002", "Sara Ali", 2.8, 88, 6, "active"],
    ["CS-2021-003", "Usman Raza", 1.9, 72, 6, "probation"],
    ["CS-2022-001", "Fatima Noor", 3.5, 65, 4, "active"],
    ["CS-2022-002", "Bilal Ahmed", 2.1, 58, 4, "active"],
    ["CS-2022-003", "Ayesha Siddiqui", 1.5, 45, 4, "probation"],
    ["CS-2023-001", "Hamza Tariq", 3.8, 35, 2, "active"],
    ["CS-2023-002", "Zainab Malik", 2.5, 30, 2, "active"],
    ["CS-2023-003", "Omar Farooq", 1.2, 18, 2, "probation"],
    ["CS-2023-004", "Hira Shah", 3.0, 32, 2, "active"],
  ];

  for (const [sid, name, cgpa, credits, semester, status] of students) {
    const attendance = 60 + Math.random() * 35;
    await client.query(
      `INSERT INTO "Student" (id, "studentId", name, program, cgpa, "totalCredits", "earnedCredits", "currentSemester", "academicStatus", "attendancePct", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, 'CS', $3, $4 + 30, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT ("studentId") DO NOTHING`,
      [sid, name, cgpa, credits, semester, status, attendance]
    );
  }
  console.log("Created students");

  // Create enrollments
  const studentRows = await client.query(`SELECT id, "currentSemester" FROM "Student"`);
  const courseRows = await client.query(`SELECT id FROM "Course"`);
  const grades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
  const gradePoints: Record<string, number> = {
    "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D": 1.0, "F": 0.0,
  };
  const semesters = ["2023-Fall", "2024-Spring", "2024-Fall", "2025-Spring", "2025-Fall", "2026-Spring"];

  for (const student of studentRows.rows) {
    const numEnrollments = Math.min(student.currentSemester * 3, 15);
    for (let i = 0; i < numEnrollments; i++) {
      const course = courseRows.rows[i % courseRows.rows.length];
      const semester = semesters[Math.floor(i / 3)] || semesters[semesters.length - 1];
      const grade = grades[Math.floor(Math.random() * grades.length)];
      const gp = gradePoints[grade];
      const status = grade === "F" ? "failed" : "passed";

      await client.query(
        `INSERT INTO "Enrollment" (id, "studentId", "courseId", semester, grade, "gradePoints", status)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
         ON CONFLICT ("studentId", "courseId", semester) DO NOTHING`,
        [student.id, course.id, semester, grade, gp, status]
      );
    }
  }
  console.log("Created enrollments");

  // Create risk predictions
  for (const student of studentRows.rows) {
    const studentDetails = await client.query(`SELECT cgpa FROM "Student" WHERE id = $1`, [student.id]);
    const cgpa = studentDetails.rows[0].cgpa;
    let riskTier: string;
    let explanation: string[];
    if (cgpa >= 2.5) {
      riskTier = "Green";
      explanation = ["On track"];
    } else if (cgpa >= 2.0) {
      riskTier = "Amber";
      explanation = ["CGPA between 2.0-2.5", "Needs attention"];
    } else {
      riskTier = "Red";
      explanation = ["CGPA below 2.0", "Academic probation"];
    }
    const confidence = 0.7 + Math.random() * 0.25;

    await client.query(
      `INSERT INTO "RiskPrediction" (id, "studentId", "riskTier", confidence, explanation, "predictedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       ON CONFLICT ("studentId") DO NOTHING`,
      [student.id, riskTier, confidence, explanation]
    );
  }
  console.log("Created risk predictions");

  // Create user
  await client.query(
    `INSERT INTO "User" (id, email, password, name, role)
     VALUES (gen_random_uuid(), 'admin@iobm.edu', 'admin123', 'Admin Faculty', 'faculty')
     ON CONFLICT (email) DO NOTHING`
  );
  console.log("Created user");

  await client.end();
  console.log("Seeding complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
