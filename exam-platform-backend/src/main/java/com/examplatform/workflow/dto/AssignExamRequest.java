package com.examplatform.workflow.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record AssignExamRequest(@NotNull Long examId, @NotNull Long userId, Instant dueAt) {}
