package com.examplatform.controller;

import com.examplatform.entity.EmailVerificationToken;
import com.examplatform.service.EmailVerificationTokenService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("denyAll()")
@RequestMapping("/api/email-verification-tokens")
public class EmailVerificationTokenController {

    private final EmailVerificationTokenService service;

    public EmailVerificationTokenController(EmailVerificationTokenService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EmailVerificationToken> create(@Valid @RequestBody EmailVerificationToken entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @GetMapping
    public ResponseEntity<List<EmailVerificationToken>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailVerificationToken> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmailVerificationToken> update(@PathVariable Long id, @Valid @RequestBody EmailVerificationToken entity) {
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
