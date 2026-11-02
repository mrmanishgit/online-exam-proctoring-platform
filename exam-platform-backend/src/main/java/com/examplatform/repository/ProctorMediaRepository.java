package com.examplatform.repository;

import com.examplatform.entity.ProctorMedia;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProctorMediaRepository extends JpaRepository<ProctorMedia, Long> {
    List<ProctorMedia> findByAttemptIdOrderByCapturedAtDesc(Long attemptId);
}
