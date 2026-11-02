package com.examplatform.dto.invitation;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class InvitationCreateRequest {
    @NotNull
    private Long examId;
    @Email
    private String email;
    private Long userId;
    private Instant expiresAt;
}
