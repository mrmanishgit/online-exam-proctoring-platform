package com.examplatform.dto.question;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private Long examId;
    private String questionText;
    private String questionType;
    private Double marks;
    private Double negativeMarks;
    private Integer displayOrder;
    private String explanation;
    private List<QuestionOptionResponse> options;
}
