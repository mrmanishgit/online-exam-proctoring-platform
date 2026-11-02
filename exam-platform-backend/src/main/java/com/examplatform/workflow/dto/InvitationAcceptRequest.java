package com.examplatform.workflow.dto;

import jakarta.validation.constraints.NotBlank;

public record InvitationAcceptRequest(@NotBlank String token) {}
