package com.examplatform.controller;

import com.examplatform.entity.CodingTestCase;
import com.examplatform.service.CodingTestCaseService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coding-test-cases")
public class CodingTestCaseController {

    private final CodingTestCaseService service;

    public CodingTestCaseController(CodingTestCaseService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CodingTestCase> create(@Valid @RequestBody CodingTestCase entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @GetMapping
    public ResponseEntity<List<CodingTestCase>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodingTestCase> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CodingTestCase> update(@PathVariable Long id, @Valid @RequestBody CodingTestCase entity) {
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
