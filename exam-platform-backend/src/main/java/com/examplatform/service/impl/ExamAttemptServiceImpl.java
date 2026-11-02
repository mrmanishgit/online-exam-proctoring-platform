package com.examplatform.service.impl;

import com.examplatform.entity.ExamAttempt;
import com.examplatform.repository.ExamAttemptRepository;
import com.examplatform.service.ExamAttemptService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExamAttemptServiceImpl implements ExamAttemptService {
    private final ExamAttemptRepository repository;

    public ExamAttemptServiceImpl(ExamAttemptRepository repository) {
        this.repository = repository;
    }

    @Override
    public ExamAttempt create(ExamAttempt entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ExamAttempt> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamAttempt> getAll() {
        return repository.findAll();
    }

    @Override
    public ExamAttempt update(Long id, ExamAttempt entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        ExamAttempt existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("ExamAttempt not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("ExamAttempt not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
