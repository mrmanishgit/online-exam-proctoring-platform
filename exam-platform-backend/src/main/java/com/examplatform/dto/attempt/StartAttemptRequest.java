package com.examplatform.dto.attempt;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartAttemptRequest {
    @NotNull
    private Long examId;
}
