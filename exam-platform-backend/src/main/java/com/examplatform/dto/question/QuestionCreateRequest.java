package com.examplatform.dto.question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class QuestionCreateRequest {
    @NotNull
    private Long examId;
    @NotBlank
    private String questionText;
    @NotBlank
    private String questionType;
    @NotNull @DecimalMin("0.0")
    private Double marks;
    @DecimalMin("0.0")
    private Double negativeMarks;
    private Integer displayOrder;
    private String explanation;
    @Valid
    private List<QuestionOptionRequest> options;
}
