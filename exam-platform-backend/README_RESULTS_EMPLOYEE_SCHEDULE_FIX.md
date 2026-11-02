# ExamPilot backend corrections — results, employee review, exam schedule

## Included changes
1. `ResultController`
   - `GET /api/results` (ADMIN): real database results, not sample records.
   - `GET /api/results/pending` (ADMIN): evaluated but unpublished results.
   - `POST /api/results/{id}/publish` (ADMIN): publish after review.
   - `GET /api/results/me` (STUDENT): only the authenticated student's published results.
   - Response is a DTO-like map with exam, student, marks, percentage, pass state, status and publication fields.
2. `EmployeeAssignmentWorkflow`
   - `GET /api/employee/attempts` response now includes submittedAt, marks, pass state and result publication state for students assigned by the logged-in employee.
   - Keeps employee scope: an employee sees attempts only for assignments that employee created.
3. `ResultRepository`
   - Entity graphs load attempt, exam and user for result views.
4. `ExamWorkflowService`
   - Future-start / ended messages now include the stored UTC schedule instant. Schedule enforcement is intentionally retained.

## Important: the 409 schedule warning
A 409 `Exam has not started yet` is correct when `exams.start_time` is later than the backend UTC time. Do not remove the check; doing so would let students start before the scheduled exam.

Inspect exam 3:
```sql
SELECT id, title, status, start_time, end_time,
       UTC_TIMESTAMP(6) AS db_utc_now,
       start_time <= UTC_TIMESTAMP(6) AS can_start,
       end_time >= UTC_TIMESTAMP(6) AS before_end
FROM exams
WHERE id = 3;
```
For an exam that should already be open, schedule its start time in the past and end time in the future. For DATETIME columns, store UTC values consistently. Frontend should send ISO-8601 timestamps with an explicit `Z` or offset, not an unqualified local date-time.

## Admin UI integration required
The backend no longer supplies fabricated result rows. Admin Results UI must call:
- `GET /api/results` for all actual results
- `GET /api/results/pending` for pending review
- `POST /api/results/{id}/publish` when admin publishes

If the Admin Results React page still contains hard-coded Candidate One / Candidate Two / Candidate Three, remove that mock array and bind it to these APIs. This source archive is backend-only; React pages are not changed here.

## Employee UI integration required
Employee Candidate Attempts must call `GET /api/employee/attempts` and render returned attempt/result fields. If the employee did not create the assignment, the attempt will not appear by design. Verify `exam_assignments.assigned_by` points to the employee who assigned the student.

## Database diagnostic queries
```sql
SELECT a.id AS attempt_id, a.exam_id, e.title, a.user_id,
       u.email, a.status, a.started_at, a.submitted_at,
       a.obtained_marks, a.total_marks,
       r.id AS result_id, r.percentage, r.published
FROM exam_attempts a
JOIN exams e ON e.id = a.exam_id
JOIN users u ON u.id = a.user_id
LEFT JOIN results r ON r.exam_attempt_id = a.id
ORDER BY a.id DESC;

SELECT ea.id, ea.exam_id, ea.user_id, ea.assigned_by,
       e.title, u.email, ea.status
FROM exam_assignments ea
JOIN exams e ON e.id = ea.exam_id
JOIN users u ON u.id = ea.user_id
ORDER BY ea.id DESC;
```

## Verification limitations
The uploaded `complc.zip` contains source files but no `pom.xml` or Maven wrapper. This patch ZIP passed archive integrity verification; a complete Maven compile/test could not be run from the supplied archive. Back up the project and merge these source files into the complete Maven project.
