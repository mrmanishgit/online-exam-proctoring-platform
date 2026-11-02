package com.examplatform.service.impl;

import com.examplatform.entity.Question;
import com.examplatform.repository.QuestionRepository;
import com.examplatform.repository.QuestionOptionRepository;
import com.examplatform.service.QuestionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository repository;
    private final QuestionOptionRepository options;

    public QuestionServiceImpl(QuestionRepository repository, QuestionOptionRepository options) {
        this.repository = repository;
        this.options = options;
    }

    @Override
    public Question create(Question entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Question> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Question> getAll() {
        return repository.findAll();
    }

    @Override
    public Question update(Long id, Question entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        Question existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("Question not found with id: " + id);
        options.deleteByQuestionId(id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
