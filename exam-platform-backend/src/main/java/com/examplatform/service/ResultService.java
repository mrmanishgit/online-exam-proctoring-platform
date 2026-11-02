package com.examplatform.service;

import com.examplatform.entity.Result;
import java.util.List;
import java.util.Optional;

public interface ResultService {
    Result create(Result entity);
    Optional<Result> getById(Long id);
    List<Result> getAll();
    Result update(Long id, Result entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
