package com.examplatform.controller;

import com.examplatform.entity.Exam;
import com.examplatform.enums.Role;
import com.examplatform.repository.ExamAttemptRepository;
import com.examplatform.repository.ExamRepository;
import com.examplatform.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {
    private final UserRepository users;
    private final ExamRepository exams;
    private final ExamAttemptRepository attempts;

    public AdminDashboardController(UserRepository users, ExamRepository exams,
                                    ExamAttemptRepository attempts) {
        this.users = users;
        this.exams = exams;
        this.attempts = attempts;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        long candidates = users.countByRole(Role.STUDENT);
        long activeExams = exams.countByStatusIgnoreCase("PUBLISHED");
        long totalAttempts = attempts.count();
        long submitted = attempts.countByStatusIgnoreCase("SUBMITTED")
                + attempts.countByStatusIgnoreCase("COMPLETED");
        double completionRate = totalAttempts == 0 ? 0.0
                : Math.round(submitted * 1000.0 / totalAttempts) / 10.0;

        List<Map<String, Object>> recent = exams.findAll().stream()
                .sorted(Comparator.comparing(Exam::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(8)
                .map(this::toRecentExam)
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalCandidates", candidates);
        response.put("activeExams", activeExams);
        response.put("totalAttempts", totalAttempts);
        response.put("completedAttempts", submitted);
        response.put("completionRate", completionRate);
        response.put("recentExams", recent);
        return response;
    }

    private Map<String, Object> toRecentExam(Exam exam) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", exam.getId());
        row.put("title", exam.getTitle() == null ? "" : exam.getTitle());
        row.put("examType", exam.getExamType() == null ? "" : exam.getExamType());
        row.put("status", exam.getStatus() == null ? "DRAFT" : exam.getStatus());
        row.put("createdAt", exam.getCreatedAt());
        return row;
    }
}
