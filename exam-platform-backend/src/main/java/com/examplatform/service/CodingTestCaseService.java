package com.examplatform.service;

import com.examplatform.entity.CodingTestCase;
import java.util.List;
import java.util.Optional;

public interface CodingTestCaseService {
    CodingTestCase create(CodingTestCase entity);
    Optional<CodingTestCase> getById(Long id);
    List<CodingTestCase> getAll();
    CodingTestCase update(Long id, CodingTestCase entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
