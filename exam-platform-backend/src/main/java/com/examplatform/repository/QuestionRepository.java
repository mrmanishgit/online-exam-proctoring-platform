package com.examplatform.repository;

import com.examplatform.entity.Question;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExamIdOrderByDisplayOrderAsc(Long examId);
    List<Question> findByQuestionTypeIgnoreCase(String questionType);
    long countByExamId(Long examId);
}
