package com.examplatform.dto.coding;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CodeSubmissionResponse {
    private Long id;
    private Long attemptId;
    private Long questionId;
    private String language;
    private String status;
    private Integer passedTestCases;
    private Integer totalTestCases;
    private String output;
    private String errorMessage;
    private Instant submittedAt;
}
