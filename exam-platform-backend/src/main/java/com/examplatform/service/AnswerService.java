package com.examplatform.service;

import com.examplatform.entity.Answer;
import java.util.List;
import java.util.Optional;

public interface AnswerService {
    Answer create(Answer entity);
    Optional<Answer> getById(Long id);
    List<Answer> getAll();
    Answer update(Long id, Answer entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
