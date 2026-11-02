
package com.examplatform.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {

		log.warn("Resource not found: {}", ex.getMessage());

		return build(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
	}

	@ExceptionHandler({ BadRequestException.class, InvalidExamStateException.class, ExamNotAvailableException.class,
			ExamAlreadyStartedException.class, MaxAttemptsExceededException.class, InvalidTokenException.class,
			TokenExpiredException.class })
	public ResponseEntity<ErrorResponse> handleBadRequest(RuntimeException ex, HttpServletRequest request) {

		log.warn("Bad request on {}: {}", request.getRequestURI(), ex.getMessage());

		return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null);
	}

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<ErrorResponse> handleConflict(DuplicateResourceException ex, HttpServletRequest request) {

		log.warn("Duplicate resource: {}", ex.getMessage());

		return build(HttpStatus.CONFLICT, ex.getMessage(), request, null);
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {

		log.warn("Unauthorized request: {}", ex.getMessage());

		return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), request, null);
	}

	@ExceptionHandler({ ForbiddenException.class, AccessDeniedException.class })
	public ResponseEntity<ErrorResponse> handleForbidden(Exception ex, HttpServletRequest request) {

		log.warn("Forbidden request: {}", request.getRequestURI());

		return build(HttpStatus.FORBIDDEN, "You do not have permission to perform this action.", request, null);
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex, HttpServletRequest request) {

		log.warn("Authentication failed: {}", ex.getMessage());

		return build(HttpStatus.UNAUTHORIZED, "Authentication is required or the credentials are invalid.", request,
				null);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
			HttpServletRequest request) {

		Map<String, String> errors = new LinkedHashMap<>();

		ex.getBindingResult().getFieldErrors()
				.forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));

		log.warn("Request validation failed: {}", errors);

		return build(HttpStatus.BAD_REQUEST, "Validation failed.", request, errors);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex,
			HttpServletRequest request) {

		Map<String, String> errors = new LinkedHashMap<>();

		ex.getConstraintViolations().forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));

		log.warn("Constraint validation failed: {}", errors);

		return build(HttpStatus.BAD_REQUEST, "Validation failed.", request, errors);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex,
			HttpServletRequest request) {

		log.error("Database integrity error on {}", request.getRequestURI(), ex);

		return build(HttpStatus.CONFLICT, "The request conflicts with existing data or a database constraint.", request,
				null);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> handleUnreadableBody(HttpMessageNotReadableException ex,
			HttpServletRequest request) {

		log.warn("Invalid request body: {}", ex.getMessage());

		return build(HttpStatus.BAD_REQUEST, "Request body is missing or contains invalid JSON.", request, null);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
			HttpServletRequest request) {

		log.warn("Invalid parameter {}: {}", ex.getName(), ex.getValue());

		return build(HttpStatus.BAD_REQUEST, "Invalid value for parameter: " + ex.getName(), request, null);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex,
			HttpServletRequest request) {

		log.warn("Unsupported HTTP method: {}", ex.getMethod());

		return build(HttpStatus.METHOD_NOT_ALLOWED, "HTTP method is not supported for this endpoint.", request, null);
	}

	@ExceptionHandler(NoHandlerFoundException.class)
	public ResponseEntity<ErrorResponse> handleNoHandler(NoHandlerFoundException ex, HttpServletRequest request) {

		log.warn("API endpoint not found: {}", request.getRequestURI());

		return build(HttpStatus.NOT_FOUND, "API endpoint was not found.", request, null);
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<ErrorResponse> handleResponseStatus(ResponseStatusException ex,
			HttpServletRequest request) {
		HttpStatus status = HttpStatus.resolve(ex.getStatusCode().value());
		if (status == null) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		String message = ex.getReason() == null ? status.getReasonPhrase() : ex.getReason();
		log.warn("Request rejected on {}: {} ({})", request.getRequestURI(), message, status.value());
		return build(status, message, request, null);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {

		// Full exception and stack trace appear in Eclipse Console.
		// Do not expose internal details to the frontend.
		log.error("Unexpected API error: {} {}", request.getMethod(), request.getRequestURI(), ex);

		return build(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.", request, null);
	}

	private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, HttpServletRequest request,
			Map<String, String> validationErrors) {

		ErrorResponse body = new ErrorResponse(Instant.now(), status.value(), status.getReasonPhrase(), message,
				request.getRequestURI(), validationErrors);

		return ResponseEntity.status(status).body(body);
	}
}
