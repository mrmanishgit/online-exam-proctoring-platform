package com.examplatform.repository;

import com.examplatform.entity.QuestionOption;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    List<QuestionOption> findByQuestionIdOrderByDisplayOrderAsc(Long questionId);
    long deleteByQuestionId(Long questionId);
}
