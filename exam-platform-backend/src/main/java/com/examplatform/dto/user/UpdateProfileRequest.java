package com.examplatform.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank @Size(max = 100) private String firstName;
    @Size(max = 100) private String lastName;
    @Pattern(regexp = "^$|^[0-9+() -]{7,20}$", message = "Phone number format is invalid")
    private String phone;
}
