package com.examplatform.controller;

import com.examplatform.dto.user.UpdateProfileRequest;
import com.examplatform.dto.user.UserResponse;
import com.examplatform.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class CurrentUserController {
    private final AuthService auth;
    public CurrentUserController(AuthService auth) { this.auth = auth; }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return auth.currentUser(authentication.getName());
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateMe(Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(auth.updateProfile(authentication.getName(), request));
    }
}
