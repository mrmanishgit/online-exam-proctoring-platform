package com.examplatform.workflow.dto;

import java.time.Instant;

public record AttemptView(Long attemptId, Long examId, String status, Instant startedAt,
                          Instant submittedAt, Double obtainedMarks, Double totalMarks) {}
