package com.examplatform.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateRequest {
    @NotBlank @Size(max = 100)
    private String firstName;
    @NotBlank @Size(max = 100)
    private String lastName;
    @NotBlank @Email @Size(max = 150)
    private String email;
    @NotBlank @Size(min = 8, max = 100)
    private String password;
    @Size(max = 20)
    private String phone;
    private String role;
    private Long departmentId;
    private Boolean enabled;
}
