package com.examplatform.service.impl;

import com.examplatform.entity.ExamInvitation;
import com.examplatform.repository.ExamInvitationRepository;
import com.examplatform.service.ExamInvitationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExamInvitationServiceImpl implements ExamInvitationService {
    private final ExamInvitationRepository repository;

    public ExamInvitationServiceImpl(ExamInvitationRepository repository) {
        this.repository = repository;
    }

    @Override
    public ExamInvitation create(ExamInvitation entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ExamInvitation> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamInvitation> getAll() {
        return repository.findAll();
    }

    @Override
    public ExamInvitation update(Long id, ExamInvitation entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        ExamInvitation existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("ExamInvitation not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("ExamInvitation not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
