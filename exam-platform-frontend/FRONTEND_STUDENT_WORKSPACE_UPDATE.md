# ExamPilot frontend student workspace update

This archive contains the uploaded `src/` tree with student workspace pages updated.

## Changes
- `src/pages/student/MyAttemptsPage.jsx`
  - Removed hard-coded ATT-1001/ATT-1002/ATT-1003 demo rows.
  - Loads the authenticated student's real attempts from `GET /api/attempts/me`.
  - Handles loading, API errors, empty state, status filtering, search and refresh.
  - Supports both flat DTO fields (`examTitle`, `examId`) and nested legacy fields.
  - Displays actual attempt ID, timestamps and marks; no fabricated demo score.
- `src/pages/student/MyResultsPage.jsx`
  - Reads the flat result DTO fields (`examTitle`, `examId`, `attemptId`) and also tolerates nested legacy fields.
  - Uses the actual `passed` boolean when available.
  - Keeps results limited to the published-results endpoint.
  - Clarifies that an attempt is visible before its result is published.
- Existing dashboard already loads live available exams, attempts and published results from APIs; it did not contain demo arrays.

## Required backend endpoints
The frontend calls:
- `GET http://localhost:8082/api/exams/available`
- `GET http://localhost:8082/api/attempts/me`
- `GET http://localhost:8082/api/results/me`

The backend must be running the updated student workspace controller and result DTO implementation. The uploaded frontend archive contains only `src/`; it does not include `package.json`, lockfile, `index.html`, or Vite configuration, so this is a source patch archive rather than a complete independently runnable React project.

## Results behavior
Your backend submission workflow sets `published=false` when it creates a result. Therefore:
- Submitted attempts should appear in My Attempts.
- Results appear in My Results only after an administrator publishes them.
This is expected behavior, not a missing frontend connection.

## Apply
Back up your existing frontend `src/` directory, then replace it with this archive's `src/` directory. Keep your existing project-level files and environment settings. Confirm `VITE_API_BASE_URL=http://localhost:8082/api` if you use a `.env` file.
