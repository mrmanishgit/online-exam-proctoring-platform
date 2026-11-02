package com.examplatform.service;

import com.examplatform.entity.RefreshToken;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenService {
    RefreshToken create(RefreshToken entity);
    Optional<RefreshToken> getById(Long id);
    List<RefreshToken> getAll();
    RefreshToken update(Long id, RefreshToken entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
