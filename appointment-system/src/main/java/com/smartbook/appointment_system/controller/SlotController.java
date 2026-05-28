package com.smartbook.appointment_system.controller;

import com.smartbook.appointment_system.dto.SlotRequest;
import com.smartbook.appointment_system.model.Slot;
import com.smartbook.appointment_system.model.User;
import com.smartbook.appointment_system.repository.SlotRepository;
import com.smartbook.appointment_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/slots")
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> createSlot(@RequestBody SlotRequest slotRequest,
    Principal principal){
        String email = principal.getName();
        User provider = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("Provider not found"));

        Slot slot = new Slot();
        slot.setStartTime(slotRequest.getStartTime());
        slot.setEndTime(slotRequest.getEndTime());
        slot.setProvider(provider);
        slot.setAvailable(true);

        boolean exists = slotRepository.existsByProviderAndStartTime(provider, slotRequest.getStartTime());
        if (exists) {
            return ResponseEntity.badRequest().body("Error: You already have a slot at this time!");
        }

        slotRepository.save(slot);
        return ResponseEntity.ok("Slot created successfully for provider: " + provider.getFullName());

    }
    @GetMapping("/available")
    public ResponseEntity<List<Slot>> getAvailableSlots(@RequestParam(required = false) Long providerId) {
        if (providerId != null) {

            return ResponseEntity.ok(slotRepository.findByProviderIdAndAvailableTrue(providerId));
        }

        return ResponseEntity.ok(slotRepository.findByAvailableTrue());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Slot>> searchSlots(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")LocalDateTime start,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")LocalDateTime end
            ){
        ResponseEntity<List<Slot>> ok = ResponseEntity.ok(slotRepository.findByAvailableTrueAndStartTimeBetween(start, end));
        return ok;
    }
}
