package com.examplatform.dto.exam;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.Instant;

@Data
public class ExamUpdateRequest {
    @Size(max = 200)
    private String title;
    @Size(max = 2000)
    private String description;
    private String examType;
    @Min(1)
    private Integer durationMinutes;
    @DecimalMin("0.0")
    private Double totalMarks;
    @DecimalMin("0.0")
    private Double passMarks;
    private Instant startAt;
    private Instant endAt;
    @Min(1)
    private Integer maxAttempts;
    private Boolean shuffleQuestions;
    private Boolean showResultImmediately;
    private String status;
}
