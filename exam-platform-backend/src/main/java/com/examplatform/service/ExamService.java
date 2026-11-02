package com.examplatform.service;

import com.examplatform.entity.Exam;
import java.util.List;
import java.util.Optional;

public interface ExamService {
    Exam create(Exam entity);
    Optional<Exam> getById(Long id);
    List<Exam> getAll();
    Exam update(Long id, Exam entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
