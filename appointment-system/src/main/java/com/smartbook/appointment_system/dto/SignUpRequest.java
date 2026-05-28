package com.smartbook.appointment_system.dto;

import lombok.Data;

import java.util.Set;

@Data
public class SignUpRequest {
    private String email;
    private String password;
    private String fullName;
    private Set<String> roles;

    private String businessName;
    private String category;

}
