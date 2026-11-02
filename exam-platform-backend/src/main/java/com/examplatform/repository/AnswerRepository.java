package com.examplatform.repository;

import com.examplatform.entity.Answer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByAttemptId(Long attemptId);
    List<Answer> findByQuestionId(Long questionId);
    Optional<Answer> findByAttemptIdAndQuestionId(Long attemptId, Long questionId);
}
