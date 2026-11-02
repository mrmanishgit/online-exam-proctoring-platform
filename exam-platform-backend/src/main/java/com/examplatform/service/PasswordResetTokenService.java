package com.examplatform.service;

import com.examplatform.entity.PasswordResetToken;
import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenService {
    PasswordResetToken create(PasswordResetToken entity);
    Optional<PasswordResetToken> getById(Long id);
    List<PasswordResetToken> getAll();
    PasswordResetToken update(Long id, PasswordResetToken entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
