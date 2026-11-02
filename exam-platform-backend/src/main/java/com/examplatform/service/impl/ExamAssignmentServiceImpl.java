package com.examplatform.service.impl;

import com.examplatform.entity.ExamAssignment;
import com.examplatform.repository.ExamAssignmentRepository;
import com.examplatform.service.ExamAssignmentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExamAssignmentServiceImpl implements ExamAssignmentService {
    private final ExamAssignmentRepository repository;

    public ExamAssignmentServiceImpl(ExamAssignmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public ExamAssignment create(ExamAssignment entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ExamAssignment> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamAssignment> getAll() {
        return repository.findAll();
    }

    @Override
    public ExamAssignment update(Long id, ExamAssignment entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        ExamAssignment existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("ExamAssignment not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("ExamAssignment not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
