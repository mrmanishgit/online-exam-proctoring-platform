package com.examplatform.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.examplatform.entity.ExamAssignment;

public interface ExamAssignmentRepository extends JpaRepository<ExamAssignment, Long> {

	@EntityGraph(attributePaths = { "exam", "user", "assignedBy" })
	List<ExamAssignment> findByExamId(Long examId);

	@EntityGraph(attributePaths = { "exam", "user", "assignedBy" })
	List<ExamAssignment> findByUserId(Long userId);

	boolean existsByExamIdAndUserId(Long examId, Long userId);

	@EntityGraph(attributePaths = { "exam", "user", "assignedBy" })
	Optional<ExamAssignment> findFirstByExamIdAndUserId(Long examId, Long userId);

	@EntityGraph(attributePaths = { "exam", "user", "assignedBy" })
	List<ExamAssignment> findByUserIdOrderByAssignedAtDesc(Long userId);

	@EntityGraph(attributePaths = { "exam", "user", "assignedBy" })
	List<ExamAssignment> findByAssignedByIdOrderByAssignedAtDesc(Long assignedById);

	@EntityGraph(attributePaths = { "exam" })
	List<ExamAssignment> findByUserIdAndStatusIgnoreCase(Long userId, String status);
}