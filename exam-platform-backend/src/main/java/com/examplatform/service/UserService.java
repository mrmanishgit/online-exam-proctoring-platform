package com.examplatform.service;

import com.examplatform.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User create(User entity);
    Optional<User> getById(Long id);
    List<User> getAll();
    User update(Long id, User entity);
    void deleteById(Long id);
    boolean existsById(Long id);
}
