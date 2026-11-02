package com.examplatform.controller;

import com.examplatform.entity.CodeSubmission;
import com.examplatform.service.CodeSubmissionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/code-submissions", "/api/coding/submissions"})
public class CodeSubmissionController {

    private final CodeSubmissionService service;

    public CodeSubmissionController(CodeSubmissionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CodeSubmission> create(@Valid @RequestBody CodeSubmission entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @GetMapping
    public ResponseEntity<List<CodeSubmission>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodeSubmission> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CodeSubmission> update(@PathVariable Long id, @Valid @RequestBody CodeSubmission entity) {
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
