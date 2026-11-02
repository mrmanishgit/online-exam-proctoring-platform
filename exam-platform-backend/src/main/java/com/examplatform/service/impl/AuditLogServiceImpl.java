package com.examplatform.service.impl;

import com.examplatform.entity.AuditLog;
import com.examplatform.repository.AuditLogRepository;
import com.examplatform.service.AuditLogService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AuditLogServiceImpl implements AuditLogService {
    private final AuditLogRepository repository;

    public AuditLogServiceImpl(AuditLogRepository repository) {
        this.repository = repository;
    }

    @Override
    public AuditLog create(AuditLog entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AuditLog> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAll() {
        return repository.findAll();
    }

    @Override
    public AuditLog update(Long id, AuditLog entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        AuditLog existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("AuditLog not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("AuditLog not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
