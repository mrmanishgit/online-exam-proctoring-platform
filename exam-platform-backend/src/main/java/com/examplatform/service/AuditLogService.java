package com.examplatform.service;

import com.examplatform.entity.AuditLog;
import java.util.List;
import java.util.Optional;

public interface AuditLogService {
    AuditLog create(AuditLog entity);
    Optional<AuditLog> getById(Long id);
    List<AuditLog> getAll();
    AuditLog update(Long id, AuditLog entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
