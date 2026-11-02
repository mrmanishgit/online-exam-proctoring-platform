package com.examplatform.workflow.dto;

import java.util.List;

public record QuestionView(Long id, String questionText, String questionType, Double marks,
                           Integer displayOrder, List<OptionView> options) {
    public record OptionView(Long id, String optionText, Integer displayOrder) {}
}
