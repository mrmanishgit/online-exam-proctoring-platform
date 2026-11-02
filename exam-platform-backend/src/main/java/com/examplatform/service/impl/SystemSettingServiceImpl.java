package com.examplatform.service.impl;

import com.examplatform.entity.SystemSetting;
import com.examplatform.repository.SystemSettingRepository;
import com.examplatform.service.SystemSettingService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SystemSettingServiceImpl implements SystemSettingService {
    private final SystemSettingRepository repository;

    public SystemSettingServiceImpl(SystemSettingRepository repository) {
        this.repository = repository;
    }

    @Override
    public SystemSetting create(SystemSetting entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SystemSetting> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemSetting> getAll() {
        return repository.findAll();
    }

    @Override
    public SystemSetting update(Long id, SystemSetting entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        SystemSetting existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("SystemSetting not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("SystemSetting not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
