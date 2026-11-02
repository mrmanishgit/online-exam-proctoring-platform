package com.examplatform.service;

import com.examplatform.entity.ProctorEvent;
import java.util.List;
import java.util.Optional;

public interface ProctorEventService {
    ProctorEvent create(ProctorEvent entity);
    Optional<ProctorEvent> getById(Long id);
    List<ProctorEvent> getAll();
    ProctorEvent update(Long id, ProctorEvent entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
