package com.examplatform.dto.attempt;

import com.examplatform.dto.question.QuestionOptionResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AttemptQuestionResponse {
    private Long questionId;
    private String questionText;
    private String questionType;
    private Double marks;
    private Integer displayOrder;
    private List<QuestionOptionResponse> options;
}
