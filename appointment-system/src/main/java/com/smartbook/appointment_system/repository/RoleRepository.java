package com.smartbook.appointment_system.repository;

import com.smartbook.appointment_system.model.Role;
import com.smartbook.appointment_system.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {

    Optional<Role> findByName(RoleName name);
}
