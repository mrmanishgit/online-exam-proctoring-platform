package com.examplatform.controller;

import com.examplatform.entity.PasswordResetToken;
import com.examplatform.service.PasswordResetTokenService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("denyAll()")
@RequestMapping("/api/password-reset-tokens")
public class PasswordResetTokenController {

    private final PasswordResetTokenService service;

    public PasswordResetTokenController(PasswordResetTokenService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PasswordResetToken> create(@Valid @RequestBody PasswordResetToken entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }

    @GetMapping
    public ResponseEntity<List<PasswordResetToken>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasswordResetToken> getById(@PathVariable Long id) {
        return service.getById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordResetToken> update(@PathVariable Long id, @Valid @RequestBody PasswordResetToken entity) {
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
