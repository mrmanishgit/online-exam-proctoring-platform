package com.examplatform.service;

import com.examplatform.dto.auth.*;
import com.examplatform.dto.user.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshTokenRequest request);
    void logout(String refreshToken);
    void verifyEmail(String token);
    void resendVerification(String email);
    void forgotPassword(String email);
    void resetPassword(ResetPasswordRequest request);
    UserResponse currentUser(String email);
    UserResponse updateProfile(String email, com.examplatform.dto.user.UpdateProfileRequest request);
}
