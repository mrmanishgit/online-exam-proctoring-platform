package com.examplatform.repository;

import com.examplatform.entity.Exam;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByStatusIgnoreCase(String status);
    long countByStatusIgnoreCase(String status);
    List<Exam> findByCreatedById(Long userId);
    List<Exam> findByTitleContainingIgnoreCase(String title);
}
