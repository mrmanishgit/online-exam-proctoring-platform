package com.examplatform.dto.proctoring;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ProctorEventResponse {
    private Long id;
    private Long attemptId;
    private String eventType;
    private String severity;
    private String description;
    private Boolean reviewed;
    private Instant occurredAt;
}
