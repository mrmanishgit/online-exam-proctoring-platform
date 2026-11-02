package com.examplatform.dto.question;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionOptionResponse {
    private Long id;
    private String optionText;
    private Integer displayOrder;
    // Do not expose correctness to candidates before submission/review.
}
