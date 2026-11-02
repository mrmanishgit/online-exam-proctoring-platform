package com.examplatform.coding;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull; import jakarta.validation.constraints.Size;
public record CodeRunRequest(@NotNull Long questionId,@NotBlank String language,@NotBlank @Size(max=50000) String sourceCode) {}
