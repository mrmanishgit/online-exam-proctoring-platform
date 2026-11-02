package com.examplatform.service;

import com.examplatform.entity.ExamInvitation;
import java.util.List;
import java.util.Optional;

public interface ExamInvitationService {
    ExamInvitation create(ExamInvitation entity);
    Optional<ExamInvitation> getById(Long id);
    List<ExamInvitation> getAll();
    ExamInvitation update(Long id, ExamInvitation entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
