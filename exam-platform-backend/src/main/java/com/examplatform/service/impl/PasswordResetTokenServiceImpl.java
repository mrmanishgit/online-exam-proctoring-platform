package com.examplatform.service.impl;

import com.examplatform.entity.PasswordResetToken;
import com.examplatform.repository.PasswordResetTokenRepository;
import com.examplatform.service.PasswordResetTokenService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {
    private final PasswordResetTokenRepository repository;

    public PasswordResetTokenServiceImpl(PasswordResetTokenRepository repository) {
        this.repository = repository;
    }

    @Override
    public PasswordResetToken create(PasswordResetToken entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PasswordResetToken> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PasswordResetToken> getAll() {
        return repository.findAll();
    }

    @Override
    public PasswordResetToken update(Long id, PasswordResetToken entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        PasswordResetToken existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("PasswordResetToken not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("PasswordResetToken not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
