package com.examplatform.service;

import com.examplatform.entity.SystemSetting;
import java.util.List;
import java.util.Optional;

public interface SystemSettingService {
    SystemSetting create(SystemSetting entity);
    Optional<SystemSetting> getById(Long id);
    List<SystemSetting> getAll();
    SystemSetting update(Long id, SystemSetting entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
