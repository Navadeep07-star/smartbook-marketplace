package com.smartbook.appointment_system;

import com.smartbook.appointment_system.model.Role;
import com.smartbook.appointment_system.model.RoleName;
import com.smartbook.appointment_system.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AppointmentSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppointmentSystemApplication.class, args);
    }

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                Role userRole = new Role();
                userRole.setName(RoleName.ROLE_USER);
                roleRepository.save(userRole);

                Role providerRole = new Role();
                providerRole.setName(RoleName.ROLE_PROVIDER);
                roleRepository.save(providerRole);

                Role adminRole = new Role();
                adminRole.setName(RoleName.ROLE_ADMIN);
                roleRepository.save(adminRole);
            }
        };
    }
}
