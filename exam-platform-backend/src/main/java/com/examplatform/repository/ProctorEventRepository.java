package com.examplatform.repository;

import com.examplatform.entity.ProctorEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProctorEventRepository extends JpaRepository<ProctorEvent, Long> {
    List<ProctorEvent> findByAttemptIdOrderByOccurredAtDesc(Long attemptId);
    List<ProctorEvent> findByReviewedFalse();
    List<ProctorEvent> findBySeverityIgnoreCase(String severity);
}
