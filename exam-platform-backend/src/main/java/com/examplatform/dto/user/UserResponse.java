package com.examplatform.dto.user;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private Long departmentId;
    private String departmentName;
    private Boolean enabled;
    private Boolean emailVerified;
    private Instant createdAt;
    private Instant updatedAt;
}
