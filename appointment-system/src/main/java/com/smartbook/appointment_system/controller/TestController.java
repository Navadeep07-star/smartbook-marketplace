package com.smartbook.appointment_system.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String userAccess(){
        return "User Content - Accessible by USER,PROVIDER , or ADMIN";
    }

    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public String providerAccess(){
        return "Provider Content - Only accessible by PROVIDER.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess(){
        return "Admin Board - Only accessible by ADMIN";

    }

}
