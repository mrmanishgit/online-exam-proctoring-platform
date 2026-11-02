package com.examplatform.service.impl;

import com.examplatform.entity.ProctorMedia;
import com.examplatform.repository.ProctorMediaRepository;
import com.examplatform.service.ProctorMediaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProctorMediaServiceImpl implements ProctorMediaService {
    private final ProctorMediaRepository repository;

    public ProctorMediaServiceImpl(ProctorMediaRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProctorMedia create(ProctorMedia entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProctorMedia> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProctorMedia> getAll() {
        return repository.findAll();
    }

    @Override
    public ProctorMedia update(Long id, ProctorMedia entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        ProctorMedia existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("ProctorMedia not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("ProctorMedia not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
