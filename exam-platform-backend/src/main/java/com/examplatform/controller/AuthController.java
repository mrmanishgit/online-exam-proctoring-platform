package com.examplatform.controller;

import com.examplatform.dto.auth.*;
import com.examplatform.dto.user.UserResponse;
import com.examplatform.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth=auth; }

    @PostMapping("/register") public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest r) {
        return ResponseEntity.status(201).body(auth.register(r));
    }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r) { return auth.login(r); }
    @PostMapping("/refresh") public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest r) { return auth.refresh(r); }
    @PostMapping("/logout") public ResponseEntity<Void> logout(@RequestBody(required=false) RefreshTokenRequest r) {
        auth.logout(r==null?null:r.getRefreshToken()); return ResponseEntity.noContent().build();
    }
    @GetMapping("/verify-email") public ResponseEntity<Map<String,String>> verify(@RequestParam String token) {
        auth.verifyEmail(token); return ResponseEntity.ok(Map.of("message","Email verified"));
    }
    @PostMapping("/resend-verification") public ResponseEntity<Map<String,String>> resend(@RequestBody Map<String,String> b) {
        auth.resendVerification(b.getOrDefault("email","")); return ResponseEntity.ok(Map.of("message","If the account requires verification, an email has been sent"));
    }
    @PostMapping("/forgot-password") public ResponseEntity<Map<String,String>> forgot(@Valid @RequestBody ForgotPasswordRequest r) {
        auth.forgotPassword(r.getEmail()); return ResponseEntity.ok(Map.of("message","If the account exists, reset instructions have been sent"));
    }
    @PostMapping("/reset-password") public ResponseEntity<Map<String,String>> reset(@Valid @RequestBody ResetPasswordRequest r) {
        auth.resetPassword(r); return ResponseEntity.ok(Map.of("message","Password reset successful"));
    }
}
