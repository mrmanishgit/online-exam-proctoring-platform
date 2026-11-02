package com.examplatform.dto.coding;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CodeSubmissionRequest {
    @NotNull
    private Long questionId;
    @NotBlank
    private String language;
    @NotBlank
    private String sourceCode;
}
