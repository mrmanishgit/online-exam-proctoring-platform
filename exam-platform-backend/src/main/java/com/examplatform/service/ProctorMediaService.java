package com.examplatform.service;

import com.examplatform.entity.ProctorMedia;
import java.util.List;
import java.util.Optional;

public interface ProctorMediaService {
    ProctorMedia create(ProctorMedia entity);
    Optional<ProctorMedia> getById(Long id);
    List<ProctorMedia> getAll();
    ProctorMedia update(Long id, ProctorMedia entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
