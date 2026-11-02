package com.examplatform.service.impl;

import com.examplatform.entity.QuestionOption;
import com.examplatform.repository.QuestionOptionRepository;
import com.examplatform.service.QuestionOptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QuestionOptionServiceImpl implements QuestionOptionService {
    private final QuestionOptionRepository repository;

    public QuestionOptionServiceImpl(QuestionOptionRepository repository) {
        this.repository = repository;
    }

    @Override
    public QuestionOption create(QuestionOption entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<QuestionOption> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionOption> getAll() {
        return repository.findAll();
    }

    @Override
    public QuestionOption update(Long id, QuestionOption entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        QuestionOption existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("QuestionOption not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("QuestionOption not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
