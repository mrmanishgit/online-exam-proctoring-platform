package com.examplatform.dto.result;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ResultResponse {
    private Long id;
    private Long examAttemptId;
    private Long examId;
    private Long studentId;
    private Double obtainedMarks;
    private Double totalMarks;
    private Double percentage;
    private String grade;
    private String status;
    private Boolean published;
    private Instant publishedAt;
    private Instant createdAt;
}
