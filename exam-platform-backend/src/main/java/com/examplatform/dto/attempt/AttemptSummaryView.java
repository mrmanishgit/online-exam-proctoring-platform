package com.examplatform.dto.attempt;

import java.time.Instant;

public record AttemptSummaryView(
        Long attemptId,
        Long examId,
        String status,
        Instant startedAt,
        Instant submittedAt,
        Instant expiresAt,
        Double obtainedMarks,
        Double totalMarks) {}
