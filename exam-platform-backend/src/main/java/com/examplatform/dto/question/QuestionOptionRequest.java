package com.examplatform.dto.question;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionOptionRequest {
    private Long id;
    @NotBlank
    private String optionText;
    private Boolean correct;
    private Integer displayOrder;
}
