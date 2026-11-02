package com.examplatform.controller;

import com.examplatform.dto.user.CreateManagedUserRequest;
import com.examplatform.dto.user.UserResponse;
import com.examplatform.entity.User;
import com.examplatform.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    public AdminUserController(UserRepository users, PasswordEncoder encoder) { this.users=users; this.encoder=encoder; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateManagedUserRequest r) {
        if (users.existsByEmailIgnoreCase(r.getEmail())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        User u = new User(); u.setFirstName(r.getFirstName().trim()); u.setLastName(r.getLastName()==null?"":r.getLastName().trim());
        u.setEmail(r.getEmail().trim().toLowerCase()); u.setPhone(r.getPhone()); u.setPassword(encoder.encode(r.getPassword()));
        u.setRole(r.getRole()); u.setEnabled(true); u.setEmailVerified(true); u.setCreatedAt(Instant.now());
        return response(users.save(u));
    }

    @GetMapping
    public List<UserResponse> list() { return users.findAll().stream().map(this::response).toList(); }

    private UserResponse response(User u) { return UserResponse.builder().id(u.getId()).firstName(u.getFirstName()).lastName(u.getLastName())
        .email(u.getEmail()).phone(u.getPhone()).role(u.getRole().name()).enabled(u.getEnabled()).emailVerified(u.getEmailVerified())
        .createdAt(u.getCreatedAt()).updatedAt(u.getUpdatedAt()).build(); }
}
