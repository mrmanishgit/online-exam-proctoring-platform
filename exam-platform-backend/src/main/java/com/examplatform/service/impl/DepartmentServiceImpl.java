package com.examplatform.service.impl;

import com.examplatform.entity.Department;
import com.examplatform.repository.DepartmentRepository;
import com.examplatform.service.DepartmentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository repository;

    public DepartmentServiceImpl(DepartmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Department create(Department entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Department> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getAll() {
        return repository.findAll();
    }

    @Override
    public Department update(Long id, Department entity) {
        if (entity == null) throw new IllegalArgumentException("Entity must not be null");
        Department existing = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
        // Keep the existing primary key and creation timestamp unchanged.
        BeanUtils.copyProperties(entity, existing, "id", "createdAt");
        return repository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("Department not found with id: " + id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
