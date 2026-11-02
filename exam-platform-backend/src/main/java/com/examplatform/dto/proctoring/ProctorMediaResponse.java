package com.examplatform.dto.proctoring;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ProctorMediaResponse {
    private Long id;
    private Long attemptId;
    private String mediaType;
    private String storageUrl;
    private Instant capturedAt;
}
