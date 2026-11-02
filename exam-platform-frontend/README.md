# ExamPilot project guide and implementation status

## Project layout
- The backend project is supplied separately in the backend ZIP.
- `frontend/`: React 19 / Vite / Material UI client.

## Roles and responsibilities

### Student
1. Register, verify email and sign in.
2. View and update own profile.
3. View exams assigned to their account that are published and inside their availability window.
4. Complete system checks and read exam instructions.
5. Start an attempt, answer questions, save answers and submit.
6. View own attempts and published results.
7. Receive notifications.
8. During an exam, send permitted proctoring events for their own active attempt.

Students must not create or assign exams, see other students' records, edit marks, or review proctoring events.

### Employee / Examiner
1. Sign in to the employee workspace.
2. Create assignments for registered student accounts using available exams.
3. View assignments created by their own account.
4. View attempts belonging to students assigned by their account.
5. Review proctoring events for attempts they are authorized to handle.
6. Track candidate progress and maintain their profile.

Employees should not manage platform-wide settings, create administrator accounts, change system security settings, or access unrelated employees' assignments.

### Administrator
1. Manage platform users and roles.
2. Create and manage exams, questions and question options.
3. Schedule, publish and cancel exams.
4. Assign exams and manage invitations.
5. Monitor active attempts and review recorded proctoring events.
6. Manage results, reports, notifications, audit logs, departments and system settings.
7. Review operational status and enforce platform policies.

## Local setup

### Backend
Requirements: JDK 21, Maven 3.9+, MySQL 8+.

1. Create a MySQL database or allow the configured URL to create `exam_platform`.
2. Set environment variables. Do not commit credentials:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET` (Base64-encoded secret with at least 32 random bytes)
   - `CORS_ALLOWED_ORIGINS=http://localhost:5173`
   - Optional `MAIL_USERNAME` and `MAIL_PASSWORD`
3. From `backend/` run:
   ```bash
   mvn clean test
   mvn spring-boot:run
   ```
4. API base URL: `http://localhost:8082/api`.
5. Swagger UI, when enabled: `http://localhost:8082/swagger-ui/index.html`.

PowerShell JWT secret generation:
```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

### Frontend
Requirements: Node.js 20.19+ or 22.12+, npm.

1. From `frontend/` run:
   ```bash
   npm install
   Copy-Item .env.example .env
   npm run dev
   ```
2. Open `http://localhost:5173`.
3. `.env` should contain `VITE_API_BASE_URL=http://localhost:8082/api`.

## Key API contracts added/connected in this update
- `GET /api/exams/available` — current student's assigned, published and currently available exams.
- `GET /api/attempts/me` — current student's attempts.
- `GET /api/student/dashboard` — current student's dashboard metrics.
- `POST /api/proctoring/events` — student records an event against their own active attempt.
- `GET /api/proctoring/admin/monitoring/sessions` — Admin active-session list.
- `GET /api/proctoring/events` — Admin event review list.
- `GET /api/proctoring/attempts/{attemptId}/events` — Employee/Admin attempt event history.
- `PATCH /api/proctoring/events/{eventId}/review` — Employee/Admin marks an event reviewed.

## Important implementation boundaries
- The live monitoring screen now loads actual `IN_PROGRESS` attempts and refreshes every 10 seconds. This is polling, not push-based live streaming. A WebSocket endpoint is configured in the backend, but authenticated event broadcasting/subscription has not been completed.
- Proctoring events are metadata (for example tab/fullscreen/camera status events). They are not webcam or screen recordings. Real video requires a consent-based media capture and secure streaming/storage service, authorization, retention rules and audit trails.
- The coding runner is intentionally unavailable unless a properly isolated execution service is configured. Do not execute untrusted student code inside the Spring Boot process.
- Email invitations and verification require valid SMTP credentials.
- The uploaded frontend source contains additional pages/components with sample/demo content or incomplete API wiring (including parts of Admin reports/results/audit logs, Student coding/attempt submission, and other management pages). These are identified for follow-up integration; do not treat a visible page as proof its workflow is production complete.
- Generic legacy CRUD controllers and entity exposure require a security review before production. Use DTOs, ownership checks, role checks and pagination for all sensitive endpoints.
- This project package has not been build-verified in this environment because Maven is unavailable and npm dependency installation could not complete. Run the commands above locally and share the first compiler/test error if one occurs.

## Recommended verification sequence
1. Start MySQL and backend; run `mvn clean test`.
2. Register or seed one ADMIN, one EMPLOYEE and one STUDENT through a controlled local setup.
3. Test login and verify role claims.
4. Admin creates a draft exam, adds questions, schedules and publishes it.
5. Employee assigns that exam to a student.
6. Student sees the assigned exam, starts, saves answers and submits.
7. Employee sees the assigned candidate attempt; Admin sees all permitted active attempts.
8. Student events appear in the Admin event review list; reviewer marks an event reviewed.
9. Publish a result and confirm only the owning student can view it.
10. Verify forbidden cross-role and cross-user requests return 403/404.
