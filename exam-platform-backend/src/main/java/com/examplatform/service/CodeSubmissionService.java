package com.examplatform.service;

import com.examplatform.entity.CodeSubmission;
import java.util.List;
import java.util.Optional;

public interface CodeSubmissionService {
    CodeSubmission create(CodeSubmission entity);
    Optional<CodeSubmission> getById(Long id);
    List<CodeSubmission> getAll();
    CodeSubmission update(Long id, CodeSubmission entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
