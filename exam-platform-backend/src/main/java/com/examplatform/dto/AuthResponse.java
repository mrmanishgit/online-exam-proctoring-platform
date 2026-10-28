
package com.examplatform.dto;

import com.examplatform.enums.Role;

public record AuthResponse(
    String token,
    String tokenType,
    Long userId,
    String fullName,
    String email,
    Role role
) {}
