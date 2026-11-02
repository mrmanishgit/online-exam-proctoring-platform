package com.examplatform.service;

import com.examplatform.entity.ExamAssignment;
import java.util.List;
import java.util.Optional;

public interface ExamAssignmentService {
    ExamAssignment create(ExamAssignment entity);
    Optional<ExamAssignment> getById(Long id);
    List<ExamAssignment> getAll();
    ExamAssignment update(Long id, ExamAssignment entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
