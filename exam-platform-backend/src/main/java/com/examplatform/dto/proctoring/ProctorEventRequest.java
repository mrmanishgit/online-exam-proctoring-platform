package com.examplatform.dto.proctoring;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class ProctorEventRequest {
    @NotNull
    private Long attemptId;
    @NotBlank
    private String eventType;
    private String severity;
    private String description;
    private Instant occurredAt;
}
