package com.examplatform.service;

import com.examplatform.entity.Department;
import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    Department create(Department entity);
    Optional<Department> getById(Long id);
    List<Department> getAll();
    Department update(Long id, Department entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
