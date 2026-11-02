# Postman smoke tests

Set `baseUrl=http://localhost:8082/api`, `accessToken` from login.

1. `POST {{baseUrl}}/attempts/start/{examId}` – student bearer token; expect 201 and attempt ID.
2. `GET {{baseUrl}}/attempts/{attemptId}/questions` – same student; verify response contains no correct-answer flags or explanation.
3. `PUT {{baseUrl}}/attempts/{attemptId}/answers` – body `{ "questionId": 1, "selectedOptionId": 1 }`; expect saved answer.
4. `POST {{baseUrl}}/attempts/{attemptId}/submit` – expect submitted status and marks/result summary.
5. Repeat question/save/submit with a different student's token – expect 403/404, never another student's data.
6. `GET {{baseUrl}}/employee/attempts` – employee bearer token; only assigned exam attempts should be returned.
7. `POST {{baseUrl}}/invitations/{token}/accept` – invitee account; expired/revoked token must fail.
8. `GET {{baseUrl}}/notifications/unread-count` and `PATCH {{baseUrl}}/notifications/{id}/read` – only own notifications.
9. `POST {{baseUrl}}/uploads` multipart field `file`; check that response contains an opaque ID, not a public filesystem path.
10. `POST {{baseUrl}}/coding/run` – requires configured external runner; reject unsupported languages and oversized source.
11. `POST {{baseUrl}}/proctoring/events` – active attempt owner only; employee/admin can review.

Also test missing/expired JWT, STUDENT accessing ADMIN endpoints, EMPLOYEE accessing unassigned exams, cross-user attempt IDs, oversized uploads, invalid MIME/signature and expired invitation tokens.
