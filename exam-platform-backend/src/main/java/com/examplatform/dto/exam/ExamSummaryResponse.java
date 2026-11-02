package com.examplatform.dto.exam;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ExamSummaryResponse {
    private Long id;
    private String title;
    private String examType;
    private Integer durationMinutes;
    private Double totalMarks;
    private Instant startAt;
    private Instant endAt;
    private String status;
}
