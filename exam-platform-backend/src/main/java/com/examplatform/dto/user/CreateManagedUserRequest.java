package com.examplatform.dto.user;

import com.examplatform.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateManagedUserRequest {
    @NotBlank @Size(max=100) private String firstName;
    @Size(max=100) private String lastName;
    @NotBlank @Email @Size(max=150) private String email;
    @NotBlank @Size(min=10,max=100) private String password;
    @Size(max=20) private String phone;
    @NotNull private Role role;
}
