package com.examplatform.proctoring;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.examplatform.entity.ExamAttempt;
import com.examplatform.entity.ProctorEvent;
import com.examplatform.entity.User;
import com.examplatform.repository.ExamAttemptRepository;
import com.examplatform.repository.ProctorEventRepository;
import com.examplatform.repository.UserRepository;
import com.examplatform.workflow.dto.ProctorEventInput;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/proctoring")
public class ProctoringWorkflowController {

    private final UserRepository users;
    private final ExamAttemptRepository attempts;
    private final ProctorEventRepository events;

    public ProctoringWorkflowController(UserRepository users,
            ExamAttemptRepository attempts, ProctorEventRepository events) {
        this.users = users;
        this.attempts = attempts;
        this.events = events;
    }

    @PostMapping("/events")
    @PreAuthorize("hasRole('STUDENT')")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Object event(@Valid @RequestBody ProctorEventInput req, Authentication auth) {
        User user = currentUser(auth);
        ExamAttempt attempt = attempts.findByIdAndUserId(req.attemptId(), user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attempt not found"));
        if (!"IN_PROGRESS".equalsIgnoreCase(attempt.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Attempt is not active");
        }

        ProctorEvent event = new ProctorEvent();
        event.setAttempt(attempt);
        event.setUser(user);
        event.setEventType(req.eventType());
        event.setDescription(req.description());
        event.setSeverity(req.severity() == null || req.severity().isBlank() ? "MEDIUM" : req.severity());
        event.setOccurredAt(Instant.now());
        event.setReviewed(false);
        return eventView(events.save(event));
    }

    @GetMapping("/attempts/{attemptId}/events")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    @Transactional(readOnly = true)
    public Object list(@PathVariable Long attemptId) {
        return events.findByAttemptIdOrderByOccurredAtDesc(attemptId)
                .stream().map(this::eventView).toList();
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public Object allEvents() {
        return events.findAll().stream()
                .sorted((a, b) -> {
                    if (a.getOccurredAt() == null) return 1;
                    if (b.getOccurredAt() == null) return -1;
                    return b.getOccurredAt().compareTo(a.getOccurredAt());
                })
                .map(this::eventView).toList();
    }

    @PatchMapping("/events/{eventId}/review")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    @Transactional
    public Object review(@PathVariable Long eventId, Authentication auth) {
        ProctorEvent event = events.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        event.setReviewed(true);
        event.setReviewedBy(currentUser(auth));
        return eventView(events.save(event));
    }

    @GetMapping("/live-sessions")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    @Transactional(readOnly = true)
    public Object live() {
        return attempts.findByStatusIgnoreCase("IN_PROGRESS").stream()
                .map(a -> sessionView(a)).toList();
    }

    @GetMapping("/admin/monitoring/sessions")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public Object adminLiveSessions() {
        return attempts.findByStatusIgnoreCase("IN_PROGRESS").stream()
                .map(this::sessionView).toList();
    }

    private User currentUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return users.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Map<String, Object> eventView(ProctorEvent event) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", event.getId());
        row.put("attemptId", event.getAttempt() == null ? null : event.getAttempt().getId());
        row.put("studentName", event.getUser() == null ? "" :
                ((event.getUser().getFirstName() == null ? "" : event.getUser().getFirstName()) +
                 (event.getUser().getLastName() == null ? "" : " " + event.getUser().getLastName())).trim());
        row.put("studentEmail", event.getUser() == null ? "" : event.getUser().getEmail());
        row.put("examTitle", event.getAttempt() == null || event.getAttempt().getExam() == null
                ? "" : event.getAttempt().getExam().getTitle());
        row.put("eventType", event.getEventType());
        row.put("description", event.getDescription());
        row.put("severity", event.getSeverity());
        row.put("occurredAt", event.getOccurredAt() == null ? "" : event.getOccurredAt().toString());
        row.put("reviewed", Boolean.TRUE.equals(event.getReviewed()));
        return row;
    }

    private Map<String, Object> sessionView(ExamAttempt attempt) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("attemptId", attempt.getId());
        row.put("status", attempt.getStatus());
        row.put("startedAt", attempt.getStartedAt() == null ? "" : attempt.getStartedAt().toString());
        row.put("studentId", attempt.getUser() == null ? null : attempt.getUser().getId());
        row.put("studentName", attempt.getUser() == null ? "" :
                ((attempt.getUser().getFirstName() == null ? "" : attempt.getUser().getFirstName()) +
                 (attempt.getUser().getLastName() == null ? "" : " " + attempt.getUser().getLastName())).trim());
        row.put("studentEmail", attempt.getUser() == null ? "" : attempt.getUser().getEmail());
        row.put("examId", attempt.getExam() == null ? null : attempt.getExam().getId());
        row.put("examTitle", attempt.getExam() == null || attempt.getExam().getTitle() == null
                ? "" : attempt.getExam().getTitle());
        row.put("flaggedEvents", events.findByAttemptIdOrderByOccurredAtDesc(attempt.getId())
                .stream().filter(e -> !Boolean.TRUE.equals(e.getReviewed())).count());
        return row;
    }
}
