package com.examplatform.controller;

import com.examplatform.entity.ExamAssignment;
import com.examplatform.service.ExamAssignmentService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/exam-assignments")
@PreAuthorize("hasRole('ADMIN')")
public class ExamAssignmentController {

    private final ExamAssignmentService service;

    public ExamAssignmentController(ExamAssignmentService service) {
        this.service = service;
    }

    // Legacy entity-based create is retained under /legacy. The primary POST /api/exam-assignments
    // is handled by EmployeeWorkflowController with a validated DTO.
    @PostMapping("/legacy")
    public ResponseEntity<ExamAssignment> create(@Valid @RequestBody ExamAssignment entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @GetMapping
    public ResponseEntity<List<ExamAssignment>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamAssignment> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamAssignment> update(@PathVariable Long id, @Valid @RequestBody ExamAssignment entity) {
        if (!service.existsById(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (!service.existsById(id)) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
