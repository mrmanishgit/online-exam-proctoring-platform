package com.examplatform.dto.exam;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ExamResponse {
    private Long id;
    private String title;
    private String description;
    private String examType;
    private Integer durationMinutes;
    private Double totalMarks;
    private Double passMarks;
    private Instant startAt;
    private Instant endAt;
    private Integer maxAttempts;
    private Boolean shuffleQuestions;
    private Boolean showResultImmediately;
    private String status;
    private Long createdById;
    private Instant createdAt;
    private Instant updatedAt;
}
