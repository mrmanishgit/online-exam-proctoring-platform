package com.examplatform.repository;

import com.examplatform.entity.CodingTestCase;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodingTestCaseRepository extends JpaRepository<CodingTestCase, Long> {
    List<CodingTestCase> findByQuestionIdOrderByDisplayOrderAsc(Long questionId);
    List<CodingTestCase> findByQuestionIdAndHiddenFalse(Long questionId);
}
