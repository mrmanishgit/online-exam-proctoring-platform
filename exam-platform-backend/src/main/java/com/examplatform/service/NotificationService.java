package com.examplatform.service;

import com.examplatform.entity.Notification;
import java.util.List;
import java.util.Optional;

public interface NotificationService {
    Notification create(Notification entity);
    Optional<Notification> getById(Long id);
    List<Notification> getAll();
    Notification update(Long id, Notification entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
