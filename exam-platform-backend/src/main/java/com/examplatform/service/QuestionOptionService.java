package com.examplatform.service;

import com.examplatform.entity.QuestionOption;
import java.util.List;
import java.util.Optional;

public interface QuestionOptionService {
    QuestionOption create(QuestionOption entity);
    Optional<QuestionOption> getById(Long id);
    List<QuestionOption> getAll();
    QuestionOption update(Long id, QuestionOption entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
