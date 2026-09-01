# PAL Framework — Student Advisory System (MVP Spec)

## Problem Statement

CS faculty at IOBM currently spend significant time manually checking student degree progress, prerequisite eligibility, and identifying at-risk students. There is no early-warning system for students heading toward academic failure. Advisors discover problems too late — often at graduation — when a missing prerequisite or insufficient credits surfaces. The institution needs a data-driven advisory tool that profiles students from existing MySQL data, flags risks, evaluates policy rules, and presents everything in a faculty-accessible dashboard — all within a 6-week build window.

## Solution

A deployed web MVP (PAL Portal) that:

1. Extracts student academic data from IOBM's existing MySQL database via a manual trigger or monthly cron
2. Maps raw data into a structured PAL student profile schema
3. Evaluates CS program policy rules (prerequisites, CGPA, credit hours, graduation readiness)
4. Predicts student risk tiers (Green / Amber / Red) using a supervised ML model
5. Displays a faculty-facing dashboard with student profiles, rule evaluations, and risk flags
6. Deploys as a working link on Vercel (frontend + API) with a Python ML microservice on Hugging Face Spaces

## User Stories

1. As a CS faculty advisor, I want to log into the PAL portal with my email and password, so that I can access student data securely
2. As a CS faculty advisor, I want to see a list of all CS students assigned to me, so that I can get an overview of my advisees
3. As a CS faculty advisor, I want to see each student's CGPA, completed credits, and current semester, so that I can assess their academic standing at a glance
4. As a CS faculty advisor, I want to see which courses a student has passed, failed, withdrawn from, or is currently enrolled in, so that I can understand their full academic history
5. As a CS faculty advisor, I want to see a student's degree progress — which requirements are met and which are remaining, so that I can advise them on course selection
6. As a CS faculty advisor, I want to see prerequisite eligibility checks (e.g., "Can this student take CSC301?"), so that I can prevent registration errors
7. As a CS faculty advisor, I want to see credit-hour limit validation (e.g., "This student is attempting 24 credits, max is 21"), so that I can enforce institutional policy
8. As a CS faculty advisor, I want to see graduation readiness status (credits complete, core courses done, CGPA threshold met), so that I can identify students close to graduating
9. As a CS faculty advisor, I want to see a risk flag (Green / Amber / Red) per student, so that I can prioritize which students need immediate intervention
10. As a CS faculty advisor, I want the risk flag to be explained (e.g., "High risk: CGPA 1.8, 3 failed courses, attendance 55%"), so that I understand WHY the student is flagged
11. As a CS faculty advisor, I want to filter students by risk tier, so that I can focus on the most vulnerable students first
12. As a CS faculty advisor, I want to search for a student by name or ID, so that I can quickly find a specific student
13. As a CS faculty advisor, I want to see a student's attendance percentage, so that I can correlate attendance with performance
14. As a CS faculty advisor, I want to see a student's FYP/thesis status (if applicable), so that I can track research progression
15. As a CS faculty advisor, I want to see previous advisory interventions and their outcomes, so that I can learn what worked before
16. As a CS faculty advisor, I want to see a student's remaining courses and estimated graduation timeline, so that I can set expectations
17. As a CS faculty advisor, I want the dashboard to be responsive (work on mobile), so that I can check student data on the go
18. As a CS faculty advisor, I want to see alerts for CGPA decline, repeated failure, or low attendance, so that I am notified of emerging problems
19. As an admin, I want to see aggregated statistics (average CGPA, risk distribution, graduation rate), so that I can assess department-level performance
20. As an admin, I want to manage which faculty members have access to which students, so that advisor assignments are correct
21. As the system, I want to run a data extraction from MySQL (manual trigger or monthly cron) and update student profiles, so that the dashboard reflects current state after registration periods or exams
22. As the system, I want to map MySQL fields to the PAL schema via a configurable mapping layer, so that schema changes don't require code rewrites
23. As the system, I want to evaluate all policy rules against each student profile, so that rule results are always up to date
24. As the system, I want to run the ML risk prediction model against updated profiles, so that risk tiers reflect the latest data
25. As a developer, I want the ingestion pipeline to gracefully handle missing or malformed data, so that one bad record doesn't crash the entire import
26. As a developer, I want the ML model to return a confidence score alongside the risk tier, so that advisors know when the model is uncertain
27. As a developer, I want the rule engine to produce auditable outputs (which rule passed/failed and why), so that decisions can be traced back to policy
28. As a developer, I want the system to log all data ingestion runs with timestamps and row counts, so that data freshness is verifiable
29. As an admin, I want to manually trigger a data sync from the dashboard, so that I can refresh student data on demand after registration periods or exam results

## Implementation Decisions

### Architecture

- **Frontend**: Next.js (App Router) deployed on Vercel
- **Backend**: Next.js API Routes (serverless on Vercel) — no separate backend server
- **Database**: IOBM's existing MySQL on GCP Cloud SQL (read-only access) → PAL internal DB (mapped schema)
- **ML Service**: Python microservice deployed on Hugging Face Spaces
- **LLM Chatbot**: Optional stretch goal (Week 5). Uses OpenAI function calling. Never accesses student data directly. Calls rule engine tools only. RAG for policy documents only.
- **Data Flow**: MySQL → Data sync (manual trigger or monthly cron) → Mapping layer (MySQL → PAL internal DB) → All downstream services read from PAL internal DB:
  - ML model → predicts Green/Amber/Red risk tier
  - Rule engine → evaluates policy rules (pass/fail per rule)
  - Dashboard → displays student profiles, risk flags, rule results
  - LLM chatbot → function calling against rule engine, explains results

### Data Layer

- Ingestion pipeline is a Next.js API route triggered either by a cron schedule (monthly) or a manual admin trigger
- Manual trigger preferred for MVP — admin clicks "Sync Data" button in dashboard to run the pipeline on demand
- Pipeline uses a configurable mapping layer: JSON config maps MySQL column names → PAL schema field names
- Mapping layer is abstracted so when real MySQL schema arrives, only the config file changes, not the code
- During development (before MySQL access), use seed data files that mimic the expected MySQL output format
- Batch processing: extract all CS students in one query, transform, and upsert into internal profile store

### Student Profile Schema (Target)

Each student profile contains:
- Student ID, name, program (CS), admission semester, current semester
- CGPA, semester-wise GPA history
- Course-wise grades, credit hours, status (passed/failed/withdrawn/enrolled)
- Attendance percentage (per course if available, aggregate otherwise)
- Completed core courses, electives, prerequisites
- Failed, repeated, withdrawn courses
- Registration history
- Academic warnings (if any)
- FYP/thesis status (if applicable)
- Maximum degree duration, remaining time
- Risk tier (output of ML model)
- Risk explanation (feature contributions)
- Advisory history (empty for MVP — no interventions yet)

### Rule Engine

- One week of focused development, non-negotiable
- Rules are digitized from CS program academic policies (user provides the rules)
- Rules represented as data (JSON), not hardcoded if/else — see handoff doc Section 10-11, 51
- Rule types for MVP: numeric threshold (CGPA), credit requirement, course requirement, boolean requirement (FYP), count requirement (failed courses), semester requirement
- Conditional and batch-specific rules deferred to Phase 2
- Each rule evaluation returns: rule ID, pass/fail, required value, actual value, and reason
- API endpoint: `POST /api/rules/evaluate` accepts student profile, returns structured rule results
- Rule engine is the authoritative source for academic decisions — LLM never independently decides eligibility

### ML Model

- **Type**: Supervised multi-class classification
- **Target variable**: Risk tier (Green / Amber / Red)
- **Labels**: Manually defined based on institutional policies (e.g., CGPA < 2.0 = High Risk, CGPA < 1.5 = Critical, 3+ failed courses = High Risk, attendance < 60% = Moderate Risk)
- **Features**: CGPA, semester GPA trend, failed course count, withdrawn course count, attendance percentage, credits completed vs expected, time remaining, prerequisite violations
- **Models**: Logistic Regression (interpretable baseline) + Decision Tree
- **Serving**: Python FastAPI/Flask service on Hugging Face Spaces, endpoint `POST /predict` accepts feature vector, returns `{ risk_tier, confidence, explanations }`
- **Training**: User trains locally using historical data, serializes model, deploys to Hugging Face

### Portal (Faculty Dashboard)

- **Login page**: Email + password authentication (JWT, httpOnly cookies)
- **Dashboard home**: Summary cards (total students, risk distribution pie chart, alerts count)
- **Student list**: Table with columns — ID, Name, Semester, CGPA, Risk Tier, Status; sortable, filterable by risk tier, searchable by name/ID
- **Student detail page**: Full profile — academic history, course grades, rule evaluation results, risk flag with explanation, degree progress bar, remaining requirements
- **Responsive**: Works on mobile (faculty may check on phones)
- **Tech**: Next.js + TypeScript, React components, Tailwind CSS for styling

### Deployment

- Frontend + API: Vercel (automatic deploys from Git)
- ML model: Hugging Face Spaces (Gradio or FastAPI)
- Data sync: Manual "Sync Data" button in dashboard (preferred for MVP). Monthly cron optional.
- No on-prem deployment for MVP

### Privacy & Security (from handoff doc)

- MySQL is never directly exposed to external APIs (OpenAI, etc.)
- All data flows through the mapping layer into PAL internal DB first
- LLM chatbot uses function calling — never gets MySQL credentials, direct DB access, or arbitrary SQL execution
- Backend retrieves only the data needed for the current request (data minimization)
- OpenAI API key remains server-side only, never in frontend
- Read-only access to MySQL for MVP (SELECT only, no UPDATE/DELETE/INSERT)
- Authentication required for all access; authorization enforced at backend, not by LLM

## Testing Decisions

- **Rule engine**: Unit tests against known student profiles — given these grades, does the rule engine correctly flag "prerequisite not met"?
- **ML model**: Evaluate on held-out test set using Accuracy, Precision, Recall, F1-score, Confusion Matrix. Recall for High/Critical risk class is the priority metric
- **Ingestion pipeline**: Test with malformed data (missing fields, wrong types, null values) — pipeline should log errors and skip bad records, not crash
- **Dashboard**: Manual QA — log in as faculty, verify student data loads, verify risk flags display, verify filters work
- **Integration**: End-to-end test — seed data → ingestion → rule evaluation → ML prediction → dashboard displays correct results
- **No formal penetration testing or load testing for MVP**

## Out of Scope

- Student-facing portal (faculty-only for MVP)
- LLM/RAG advisory assistant (add if time permits in Week 6, otherwise cut)
- Live SIS/LMS integration (uses batch MySQL extract instead)
- Audit logging system (structured console logs only)
- Multi-program support (CS only)
- Advisor-in-the-loop workflow (accept/modify/reject recommendations)
- Mobile app (responsive web only)
- On-prem deployment
- Concurrency/load testing
- Formal RBAC audit
- Data retention/compliance policies
- Bias/drift monitoring for ML model
- Policy provenance/versioning system

## Further Notes

- The 6-week timeline is hard-coded by the institution. No extensions.
- The MySQL schema is currently unknown. Week 1 includes data exploration. The mapping layer must be built to adapt when the schema arrives.
- Risk labels for ML training will be manually created based on institutional policy rules, not historical advisor decisions.
- The project is university-funded and commissioned by IOBM leadership. Faculty (HODs, Deans) are the intended pilot users.
- opencode is the primary development accelerator. The developer is an academic/lecturer (Python-strong, TypeScript-capable with AI assistance).
- The deliverable is a WORKING DEPLOYED LINK, not a report or thesis.
- Phase 2 (LLM, advanced ML, governance, live integrations) is explicitly out of scope for this MVP.
