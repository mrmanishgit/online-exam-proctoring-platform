package com.examplatform.workflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProctorEventInput(@NotNull Long attemptId, @NotBlank String eventType,
                                String description, String severity) {}
