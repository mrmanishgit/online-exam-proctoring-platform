package com.examplatform.repository;

import com.examplatform.entity.ExamInvitation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamInvitationRepository extends JpaRepository<ExamInvitation, Long> {
    List<ExamInvitation> findByExamId(Long examId);
    List<ExamInvitation> findByEmailIgnoreCase(String email);
    Optional<ExamInvitation> findByInvitationToken(String invitationToken);
    List<ExamInvitation> findByStatusIgnoreCase(String status);
}
