package com.examplatform.controller;

import com.examplatform.entity.Result;
import com.examplatform.service.ResultService;
import com.examplatform.repository.ResultRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService service;
    private final ResultRepository results;

    public ResultController(ResultService service, ResultRepository results) {
        this.service = service;
        this.results = results;
    }

    /**
     * Students can see only their own results after an administrator publishes them.
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> myResults(Authentication authentication) {
        List<Map<String, Object>> response = results
                .findByExamAttempt_User_EmailIgnoreCaseAndPublishedTrueOrderByPublishedAtDesc(
                        authentication.getName())
                .stream()
                .map(this::toStudentResultView)
                .toList();

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toStudentResultView(Result result) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", result.getId());
        row.put("resultId", result.getId());
        row.put("attemptId", result.getExamAttempt() == null ? null : result.getExamAttempt().getId());
        row.put("examId", result.getExamAttempt() == null || result.getExamAttempt().getExam() == null
                ? null : result.getExamAttempt().getExam().getId());
        row.put("examTitle", result.getExamAttempt() == null || result.getExamAttempt().getExam() == null
                ? "" : Objects.toString(result.getExamAttempt().getExam().getTitle(), ""));
        row.put("obtainedMarks", result.getObtainedMarks());
        row.put("totalMarks", result.getTotalMarks());
        row.put("percentage", result.getPercentage());
        row.put("grade", result.getGrade());
        row.put("status", result.getStatus());
        row.put("passed", result.getExamAttempt() == null ? null : result.getExamAttempt().getPassed());
        row.put("published", result.getPublished());
        row.put("publishedAt", result.getPublishedAt() == null ? null : result.getPublishedAt().toString());
        row.put("remarks", result.getRemarks());
        return row;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Result> create(@Valid @RequestBody Result entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Result>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Result> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Result> update(@PathVariable Long id, @Valid @RequestBody Result entity) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
