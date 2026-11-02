package com.examplatform.service.impl;

import com.examplatform.entity.ProctorEvent;
import com.examplatform.repository.ProctorEventRepository;
import com.examplatform.service.ProctorEventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProctorEventServiceImpl implements ProctorEventService {
    private final ProctorEventRepository repository;

    public ProctorEventServiceImpl(ProctorEventRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProctorEvent create(ProctorEvent entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProctorEvent> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProctorEvent> getAll() {
        return repository.findAll();
    }

    @Override
    public ProctorEvent update(Long id, ProctorEvent entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        ProctorEvent existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("ProctorEvent not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("ProctorEvent not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
