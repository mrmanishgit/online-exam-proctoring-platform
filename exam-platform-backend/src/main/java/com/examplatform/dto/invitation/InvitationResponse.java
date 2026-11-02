package com.examplatform.dto.invitation;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class InvitationResponse {
    private Long id;
    private Long examId;
    private String email;
    private Long userId;
    private String status;
    private String invitationToken;
    private Instant expiresAt;
    private Instant createdAt;
}
