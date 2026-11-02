package com.examplatform.dto.attempt;

import java.util.List;

public record AttemptQuestionView(
        Long questionId,
        String questionText,
        String questionType,
        Double marks,
        Integer displayOrder,
        List<OptionView> options) {
    public record OptionView(Long id, String optionText, Integer displayOrder) {}
}
