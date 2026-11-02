package com.examplatform.service.impl;

import com.examplatform.entity.CodeSubmission;
import com.examplatform.repository.CodeSubmissionRepository;
import com.examplatform.service.CodeSubmissionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CodeSubmissionServiceImpl implements CodeSubmissionService {
    private final CodeSubmissionRepository repository;

    public CodeSubmissionServiceImpl(CodeSubmissionRepository repository) {
        this.repository = repository;
    }

    @Override
    public CodeSubmission create(CodeSubmission entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CodeSubmission> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CodeSubmission> getAll() {
        return repository.findAll();
    }

    @Override
    public CodeSubmission update(Long id, CodeSubmission entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        CodeSubmission existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("CodeSubmission not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("CodeSubmission not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
