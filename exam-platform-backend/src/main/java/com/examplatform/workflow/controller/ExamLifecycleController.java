package com.examplatform.workflow.controller;

import com.examplatform.entity.Exam;
import com.examplatform.repository.ExamRepository;
import com.examplatform.repository.QuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
public class ExamLifecycleController {
    private final ExamRepository exams;
    private final QuestionRepository questions;

    public ExamLifecycleController(ExamRepository exams, QuestionRepository questions) {
        this.exams = exams;
        this.questions = questions;
    }

    @PutMapping("/{id}/schedule")
    public Exam schedule(@PathVariable Long id, @RequestBody ScheduleRequest request) {
        Exam exam = exams.findById(id).orElseThrow(() -> new EntityNotFoundException("Exam not found"));
        if (request.startTime() == null || request.endTime() == null || !request.endTime().isAfter(request.startTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid start and end time are required");
        }
        if (!"DRAFT".equalsIgnoreCase(exam.getStatus()) && !"SCHEDULED".equalsIgnoreCase(exam.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only draft or scheduled exams can be rescheduled");
        }
        exam.setStartTime(request.startTime());
        exam.setEndTime(request.endTime());
        exam.setStatus("SCHEDULED");
        exam.setUpdatedAt(Instant.now());
        return exams.save(exam);
    }

    @PostMapping("/{id}/publish")
    public Exam publish(@PathVariable Long id) {
        Exam exam = exams.findById(id).orElseThrow(() -> new EntityNotFoundException("Exam not found"));
        if (questions.countByExamId(id) == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Add at least one question before publishing");
        }
        if (exam.getStartTime() == null || exam.getEndTime() == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Schedule the exam before publishing");
        }
        if (!exam.getEndTime().isAfter(exam.getStartTime())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Exam schedule is invalid");
        }
        exam.setStatus("PUBLISHED");
        exam.setUpdatedAt(Instant.now());
        return exams.save(exam);
    }

    @PostMapping("/{id}/cancel")
    public Exam cancel(@PathVariable Long id) {
        Exam exam = exams.findById(id).orElseThrow(() -> new EntityNotFoundException("Exam not found"));
        exam.setStatus("CANCELLED");
        exam.setUpdatedAt(Instant.now());
        return exams.save(exam);
    }

    public record ScheduleRequest(Instant startTime, Instant endTime) {}
}
