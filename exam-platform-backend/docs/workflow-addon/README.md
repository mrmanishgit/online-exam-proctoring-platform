# ExamPilot – Workflow Implementation Add-on

This add-on is generated against the entity/repository names in the supplied `ExamPilot_Backend_Updated.zip` (Spring Boot 4.0.9 / Java 21).

## Important integration notes

* This is an **add-on**, not a replacement for your existing backend. Back up your project first.
* The supplied backend has generic CRUD controllers for several of these resources. Do not leave unsafe generic POST/PUT/DELETE routes enabled alongside these workflow routes. Restrict them to ADMIN or remove them after verifying the replacement routes.
* Copy the `src/main/java` tree into the same package path. Resolve any duplicate route mappings before starting the application.
* The add-on uses the existing entity fields as supplied: `Exam`, `ExamAttempt`, `Answer`, `Question`, `QuestionOption`, `ExamAssignment`, `ExamInvitation`, `Notification`, `Result`, `ProctorEvent`, `ProctorMedia`, `CodeSubmission`, `CodingTestCase`, `User`.
* Existing repository methods are reused where possible. Repository additions are in `docs/REPOSITORY-ADDITIONS.md`.
* Coding execution is deliberately an adapter contract. Configure an external isolated Judge0-compatible runner; this project must never execute submitted code in the Spring Boot process.
* File storage defaults to a private local directory outside `static`/`public`. For production use private object storage, malware scanning, retention rules and authorization.
* Live proctoring uses authenticated REST event ingestion plus a WebSocket/STOMP broker configuration. Browser media capture/consent and TLS deployment remain frontend/deployment responsibilities.
* Run the SQL/data migration notes before using a production database. `ddl-auto=update` is not a production migration strategy.

## Copy and run

1. Back up the backend folder and database.
2. Copy this add-on's `src/main/java/com/examplatform` into your backend source tree.
3. Apply repository additions from `docs/REPOSITORY-ADDITIONS.md`.
4. Add the properties from `src/main/resources/application-workflows-example.properties` to your existing `application.properties`, changing paths/secrets.
5. Ensure your `SecurityConfig` enables method security (`@EnableMethodSecurity`) and authorizes `/api/**` by JWT.
6. Resolve duplicate mappings in old generic CRUD controllers (see `docs/ROUTE-MIGRATION.md`).
7. Run `mvn clean test`, then start the backend and follow `docs/POSTMAN-TESTS.md`.

## Coverage

Included: attempt start/question delivery/answer autosave/submission, objective grading/result creation, employee assignments and review queue, invitation acceptance/expiry/revocation, notification ownership/unread count, private file upload/download, coding-runner adapter boundary, proctoring event/media metadata/review/live WebSocket broadcast, and test examples.

Not included as a turnkey production service: an actual hosted Judge0 account/runner, malware scanner, S3 credentials, camera permission UI, privacy/legal consent text, production WebSocket broker, or CI environment. Those require infrastructure and secrets that cannot be safely invented in source code.

## Known implementation boundaries

* Manual marking for essay/subjective answers is not automatically inferred; this add-on grades objective selected-option answers. Add an employee marking rubric/score endpoint before publishing mixed-question results.
* Assignment workflow supports assigning an exam to an employee and lists attempts for exams assigned to that employee. Candidate review scoring and detailed employee-to-candidate allocation policies should be added to your business rules.
* Invitation acceptance changes invitation state; sending/resending email requires wiring your existing mail service and a frontend invite-acceptance flow.
* Upload code stores private files and returns an opaque storage key. A production download endpoint must verify ownership/role and stream the file; do not expose the directory through static resource handling.
* Coding `/run` intentionally returns HTTP 503 until a real remote sandbox adapter replaces `UnavailableRunner`. This is safer than pretending code execution works.
* WebSocket config creates a SockJS/STOMP endpoint. The REST proctoring event endpoints are implemented; production WebSocket authentication/interceptor and broker authorization still need to be added before exposing the socket publicly.
* The included source has not been compiled in this environment. Run Maven locally and fix any version-specific Spring Boot 4 API differences before deployment.
