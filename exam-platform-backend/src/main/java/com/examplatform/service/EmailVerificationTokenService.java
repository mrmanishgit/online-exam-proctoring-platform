package com.examplatform.service;

import com.examplatform.entity.EmailVerificationToken;
import java.util.List;
import java.util.Optional;

public interface EmailVerificationTokenService {
    EmailVerificationToken create(EmailVerificationToken entity);
    Optional<EmailVerificationToken> getById(Long id);
    List<EmailVerificationToken> getAll();
    EmailVerificationToken update(Long id, EmailVerificationToken entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
