package com.examplatform.workflow.dto;

import jakarta.validation.constraints.NotNull;

public record SaveAnswerRequest(@NotNull Long questionId, Long selectedOptionId, String answerText) {}
