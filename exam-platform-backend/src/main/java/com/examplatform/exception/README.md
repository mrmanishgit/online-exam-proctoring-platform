# Exam Platform Exception Package

Package: `com.examplatform.exception`

Copy the `exception` directory into:
`src/main/java/com/examplatform/`

Included:
- Application exceptions for common API/domain failures
- `ErrorResponse` standard API error payload
- `GlobalExceptionHandler` using `@RestControllerAdvice`

Requirements:
- Spring Boot Web
- Spring Security (for AccessDeniedException / AuthenticationException)
- Jakarta Validation
- Jakarta Servlet API (normally provided by Spring Boot Web)

Important:
- Do not add another `@RestControllerAdvice` that handles the same exceptions.
- If your project already has an `ApiExceptionHandler`, merge handlers or keep only one global handler.
- The general handler intentionally returns a generic 500 message. Add server-side logging for diagnostics.
