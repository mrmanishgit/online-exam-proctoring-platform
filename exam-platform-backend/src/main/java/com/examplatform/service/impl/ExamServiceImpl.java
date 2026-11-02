package com.examplatform.service.impl;

import com.examplatform.entity.Exam;
import com.examplatform.repository.ExamRepository;
import com.examplatform.service.ExamService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExamServiceImpl implements ExamService {
    private final ExamRepository repository;

    public ExamServiceImpl(ExamRepository repository) {
        this.repository = repository;
    }

    @Override
    public Exam create(Exam entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Exam> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Exam> getAll() {
        return repository.findAll();
    }

    @Override
    public Exam update(Long id, Exam entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        Exam existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("Exam not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
