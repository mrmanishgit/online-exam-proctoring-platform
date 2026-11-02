package com.examplatform.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @Size(max = 100)
    private String firstName;
    @Size(max = 100)
    private String lastName;
    @Email @Size(max = 150)
    private String email;
    @Size(max = 20)
    private String phone;
    private String role;
    private Long departmentId;
    private Boolean enabled;
}
