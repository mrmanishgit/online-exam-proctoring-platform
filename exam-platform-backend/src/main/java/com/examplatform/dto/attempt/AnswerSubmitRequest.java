package com.examplatform.dto.attempt;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class AnswerSubmitRequest {
    @NotNull
    private Long questionId;
    private Long selectedOptionId;
    private List<Long> selectedOptionIds;
    private String answerText;
    private String code;
    private String language;
}
