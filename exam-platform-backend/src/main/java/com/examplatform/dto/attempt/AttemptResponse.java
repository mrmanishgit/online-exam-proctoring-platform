package com.examplatform.dto.attempt;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AttemptResponse {
    private Long id;
    private Long examId;
    private Long userId;
    private String status;
    private Instant startedAt;
    private Instant submittedAt;
    private Instant expiresAt;
    private Double obtainedMarks;
}
