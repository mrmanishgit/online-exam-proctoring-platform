package com.examplatform.service.impl;

import com.examplatform.entity.Answer;
import com.examplatform.repository.AnswerRepository;
import com.examplatform.service.AnswerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List; 
import java.util.Optional;

@Service
@Transactional
public class AnswerServiceImpl implements AnswerService {
    private final AnswerRepository repository;

    public AnswerServiceImpl(AnswerRepository repository) {
        this.repository = repository;
    }

    @Override
    public Answer create(Answer entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Answer> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Answer> getAll() {
        return repository.findAll();
    }

    @Override
    public Answer update(Long id, Answer entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        Answer existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Answer not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("Answer not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
