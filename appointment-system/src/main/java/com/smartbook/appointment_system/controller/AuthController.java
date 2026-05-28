package com.smartbook.appointment_system.controller;

import com.smartbook.appointment_system.dto.JwtResponse;
import com.smartbook.appointment_system.dto.LoginRequest;
import com.smartbook.appointment_system.dto.SignUpRequest;
import com.smartbook.appointment_system.model.Role;
import com.smartbook.appointment_system.model.User;
import com.smartbook.appointment_system.model.RoleName;
import com.smartbook.appointment_system.repository.RoleRepository;
import com.smartbook.appointment_system.repository.UserRepository;
import com.smartbook.appointment_system.service.UserDetailsImpl;
import com.smartbook.appointment_system.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setFullName(signUpRequest.getFullName());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Set<String> strRoles = signUpRequest.getRoles();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if ("provider".equalsIgnoreCase(role) || "ROLE_PROVIDER".equalsIgnoreCase(role)) {
                    Role providerRole = roleRepository.findByName(RoleName.ROLE_PROVIDER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(providerRole);
                } else {
                    Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);

        if (signUpRequest.getRoles() != null && signUpRequest.getRoles().contains("provider")) {
            user.setBusinessName(signUpRequest.getBusinessName());
            user.setCategory(signUpRequest.getCategory());
            user.setRating(5.0);
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticationUser(@RequestBody LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken(authentication);
        System.out.println("Generated JWT: " + jwt);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());


        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User profile context missing"));


        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                user.getFullName(),
                roles));
    }

    @GetMapping("/providers")
    public ResponseEntity<List<User>> getProvidersByCategory(@RequestParam String category) {
        List<User> providers = userRepository.findByCategory(category);
        return ResponseEntity.ok(providers);
    }
}