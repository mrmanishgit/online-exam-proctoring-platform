package com.examplatform.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.examplatform.entity.Exam;
import com.examplatform.entity.ExamAttempt;
import com.examplatform.entity.User;
import com.examplatform.repository.ExamAssignmentRepository;
import com.examplatform.repository.ExamAttemptRepository;
import com.examplatform.repository.ResultRepository;
import com.examplatform.repository.UserRepository;

@RestController
@PreAuthorize("hasRole('STUDENT')")
public class StudentWorkspaceController {

    private final UserRepository users;
    private final ExamAttemptRepository attempts;
    private final ResultRepository results;
    private final ExamAssignmentRepository assignments;

    public StudentWorkspaceController(
            UserRepository users,
            ExamAttemptRepository attempts,
            ResultRepository results,
            ExamAssignmentRepository assignments) {
        this.users = users;
        this.attempts = attempts;
        this.results = results;
        this.assignments = assignments;
    }

    private User currentStudent(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return users.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @GetMapping("/api/exams/available")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> availableExams(Authentication auth) {
        User user = currentStudent(auth);
        Instant now = Instant.now();
        Map<Long, Map<String, Object>> unique = new LinkedHashMap<>();

        assignments.findByUserIdAndStatusIgnoreCase(user.getId(), "ASSIGNED").stream()
                .map(a -> a.getExam())
                .filter(Objects::nonNull)
                .filter(e -> e.getId() != null)
                .filter(e -> "PUBLISHED".equalsIgnoreCase(e.getStatus()))
                .forEach(e -> unique.putIfAbsent(e.getId(), toExamView(e, now)));

        return List.copyOf(unique.values());
    }

    private Map<String, Object> toExamView(Exam e, Instant now) {
        boolean beforeStart = e.getStartTime() != null && now.isBefore(e.getStartTime());
        boolean afterEnd = e.getEndTime() != null && now.isAfter(e.getEndTime());

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", e.getId());
        row.put("title", Objects.toString(e.getTitle(), ""));
        row.put("description", Objects.toString(e.getDescription(), ""));
        row.put("subject", Objects.toString(e.getSubject(), ""));
        row.put("examType", Objects.toString(e.getExamType(), ""));
        row.put("durationMinutes", e.getDurationMinutes() == null ? 0 : e.getDurationMinutes());
        row.put("totalMarks", e.getTotalMarks() == null ? 0.0 : e.getTotalMarks());
        row.put("passingMarks", e.getPassingMarks() == null ? 0.0 : e.getPassingMarks());
        row.put("status", Objects.toString(e.getStatus(), ""));
        row.put("startTime", e.getStartTime() == null ? "" : e.getStartTime().toString());
        row.put("endTime", e.getEndTime() == null ? "" : e.getEndTime().toString());
        row.put("canStart", !beforeStart && !afterEnd);
        row.put("availability", beforeStart ? "UPCOMING" : (afterEnd ? "ENDED" : "AVAILABLE"));
        row.put("availabilityMessage", beforeStart ? "Exam has not started yet"
                : (afterEnd ? "Exam schedule has ended" : "You can start this exam"));
        return row;
    }

    /**
     * Returns only attempts belonging to the authenticated student.
     * Convert entities to maps while the read transaction is open; never serialize
     * lazy JPA relationships directly from this endpoint.
     */
    @GetMapping("/api/attempts/me")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> myAttempts(Authentication auth) {
        User user = currentStudent(auth);

        return attempts.findByUserIdOrderByStartedAtDesc(user.getId())
                .stream()
                .map(this::toAttemptView)
                .toList();
    }

    private Map<String, Object> toAttemptView(ExamAttempt attempt) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", attempt.getId());
        row.put("attemptId", attempt.getId());
        row.put("examId", attempt.getExam() == null ? null : attempt.getExam().getId());
        row.put("examTitle", attempt.getExam() == null ? "" :
                Objects.toString(attempt.getExam().getTitle(), ""));
        row.put("status", Objects.toString(attempt.getStatus(), ""));
        row.put("startedAt", attempt.getStartedAt() == null ? null : attempt.getStartedAt().toString());
        row.put("submittedAt", attempt.getSubmittedAt() == null ? null : attempt.getSubmittedAt().toString());
        row.put("obtainedMarks", attempt.getObtainedMarks());
        row.put("totalMarks", attempt.getTotalMarks());
        row.put("passed", attempt.getPassed());
        return row;
    }

    @GetMapping("/api/student/dashboard")
    @Transactional(readOnly = true)
    public Map<String, Object> dashboard(Authentication auth) {
        User user = currentStudent(auth);
        var myAttempts = attempts.findByUserIdOrderByStartedAtDesc(user.getId());
        var myResults = results
                .findByExamAttempt_User_EmailIgnoreCaseAndPublishedTrueOrderByPublishedAtDesc(auth.getName());

        double average = myResults.stream()
                .filter(r -> r.getPercentage() != null)
                .mapToDouble(r -> r.getPercentage().doubleValue())
                .average().orElse(0.0);
        average = Math.round(average * 10.0) / 10.0;

        long available = availableExams(auth).size();
        long completed = myAttempts.stream()
                .filter(a -> "SUBMITTED".equalsIgnoreCase(a.getStatus())
                        || "COMPLETED".equalsIgnoreCase(a.getStatus()))
                .count();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("availableExams", available);
        response.put("totalAttempts", myAttempts.size());
        response.put("completedAttempts", completed);
        response.put("publishedResults", myResults.size());
        response.put("averageScore", average);
        return response;
    }
}
