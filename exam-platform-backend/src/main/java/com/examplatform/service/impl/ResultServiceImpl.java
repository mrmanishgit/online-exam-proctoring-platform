package com.examplatform.service.impl;

import com.examplatform.entity.Result;
import com.examplatform.repository.ResultRepository;
import com.examplatform.service.ResultService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ResultServiceImpl implements ResultService {
    private final ResultRepository repository;

    public ResultServiceImpl(ResultRepository repository) {
        this.repository = repository;
    }

    @Override
    public Result create(Result entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Result> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Result> getAll() {
        return repository.findAll();
    }

    @Override
    public Result update(Long id, Result entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        Result existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Result not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("Result not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
