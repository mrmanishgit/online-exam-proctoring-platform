package com.examplatform.service;

import com.examplatform.entity.ExamAttempt;
import java.util.List;
import java.util.Optional;

public interface ExamAttemptService {
    ExamAttempt create(ExamAttempt entity);
    Optional<ExamAttempt> getById(Long id);
    List<ExamAttempt> getAll();
    ExamAttempt update(Long id, ExamAttempt entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
