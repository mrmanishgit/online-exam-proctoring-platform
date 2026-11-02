package com.examplatform.dto.notification;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MarkNotificationReadRequest {
    @NotNull
    private Boolean read;
}
