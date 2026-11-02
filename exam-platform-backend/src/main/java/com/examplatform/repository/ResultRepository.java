package com.examplatform.repository;

import com.examplatform.entity.Result;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, Long> {

    Optional<Result> findByExamAttemptId(Long examAttemptId);

    @EntityGraph(attributePaths = {"examAttempt", "examAttempt.exam"})
    List<Result> findByPublishedTrueOrderByPublishedAtDesc();

    @EntityGraph(attributePaths = {"examAttempt", "examAttempt.exam"})
    List<Result> findByPublishedFalseOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"examAttempt", "examAttempt.exam", "examAttempt.user"})
    List<Result> findByExamAttempt_User_EmailIgnoreCaseAndPublishedTrueOrderByPublishedAtDesc(String email);
}
