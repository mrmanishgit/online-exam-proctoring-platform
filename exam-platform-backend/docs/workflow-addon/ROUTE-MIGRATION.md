# Route migration / avoid duplicate unsafe routes

The supplied backend has generic entity CRUD endpoints for answers, attempts, assignments, invitations, notifications, results, code submissions and proctor events. Those generic endpoints accept entity-shaped payloads and can bypass business rules.

Before enabling this add-on:

* Remove or restrict generic `POST`, `PUT`, and `DELETE` mappings for `/api/answers`, `/api/exam-attempts`, `/api/exam-assignments`, `/api/exam-invitations`, `/api/notifications`, `/api/results`, `/api/code-submissions`, `/api/proctor-events`, and `/api/proctor-media` to ADMIN only.
* Keep read endpoints only if they enforce role and ownership. Prefer the new workflow endpoints.
* Keep `/api/attempts/**` as the student workflow namespace; do not expose entity IDs without ownership checks.
* Admin-only endpoints must use `@PreAuthorize("hasRole('ADMIN')")`; employee review endpoints must use `@PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")` plus assignment checks.
* Do not allow students to create/update `Result`, `ExamAttempt`, `ExamAssignment`, `ExamInvitation`, `ProctorMedia`, or `CodeSubmission` entity records directly.
