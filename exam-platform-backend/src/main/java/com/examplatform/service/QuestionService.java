package com.examplatform.service;

import com.examplatform.entity.Question;
import java.util.List;
import java.util.Optional;

public interface QuestionService {
    Question create(Question entity);
    Optional<Question> getById(Long id);
    List<Question> getAll();
    Question update(Long id, Question entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
