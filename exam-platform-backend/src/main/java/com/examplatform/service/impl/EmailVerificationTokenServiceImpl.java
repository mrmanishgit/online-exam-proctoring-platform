package com.examplatform.service.impl;

import com.examplatform.entity.EmailVerificationToken;
import com.examplatform.repository.EmailVerificationTokenRepository;
import com.examplatform.service.EmailVerificationTokenService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmailVerificationTokenServiceImpl implements EmailVerificationTokenService {
    private final EmailVerificationTokenRepository repository;

    public EmailVerificationTokenServiceImpl(EmailVerificationTokenRepository repository) {
        this.repository = repository;
    }

    @Override
    public EmailVerificationToken create(EmailVerificationToken entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmailVerificationToken> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmailVerificationToken> getAll() {
        return repository.findAll();
    }

    @Override
    public EmailVerificationToken update(Long id, EmailVerificationToken entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        EmailVerificationToken existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("EmailVerificationToken not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("EmailVerificationToken not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
