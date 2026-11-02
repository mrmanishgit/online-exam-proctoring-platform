package com.examplatform.dto.attempt;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class SubmitAttemptRequest {
    @NotEmpty @Valid
    private List<AnswerSubmitRequest> answers;
}
