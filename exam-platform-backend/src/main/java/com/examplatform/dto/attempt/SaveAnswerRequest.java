package com.examplatform.dto.attempt;

import jakarta.validation.constraints.NotNull;

public record SaveAnswerRequest(
        @NotNull Long questionId,
        Long selectedOptionId,
        String answerText) {}
