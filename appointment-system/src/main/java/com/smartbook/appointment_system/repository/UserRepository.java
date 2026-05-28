package com.smartbook.appointment_system.repository;

import com.smartbook.appointment_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByCategory(String category);
}

