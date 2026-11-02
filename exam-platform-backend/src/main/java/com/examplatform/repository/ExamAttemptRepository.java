
package com.examplatform.repository;

import com.examplatform.entity.ExamAttempt;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {

    @EntityGraph(attributePaths = {"exam"})
    List<ExamAttempt> findByUserIdOrderByStartedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"exam"})
    Optional<ExamAttempt> findByIdAndUserId(Long id, Long userId);

    @EntityGraph(attributePaths = {"exam"})
    List<ExamAttempt> findByExamId(Long examId);

    List<ExamAttempt> findByStatusIgnoreCase(String status);

    long countByStatusIgnoreCase(String status);

    @EntityGraph(attributePaths = {"exam"})
    Optional<ExamAttempt> findFirstByExamIdAndUserIdOrderByStartedAtDesc(
            Long examId, Long userId
    );
}
