package com.examplatform.repository;

import com.examplatform.entity.CodeSubmission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {
    List<CodeSubmission> findByAttemptIdOrderBySubmittedAtDesc(Long attemptId);
    List<CodeSubmission> findByQuestionId(Long questionId);
    List<CodeSubmission> findByStatusIgnoreCase(String status);
}
