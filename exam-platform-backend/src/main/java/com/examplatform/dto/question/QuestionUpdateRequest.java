package com.examplatform.dto.question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class QuestionUpdateRequest {
    @Size(min = 1)
    private String questionText;
    private String questionType;
    @DecimalMin("0.0")
    private Double marks;
    @DecimalMin("0.0")
    private Double negativeMarks;
    private Integer displayOrder;
    private String explanation;
    @Valid
    private List<QuestionOptionRequest> options;
}
