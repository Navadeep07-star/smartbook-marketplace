package com.smartbook.appointment_system.controller;

import com.smartbook.appointment_system.model.Booking;
import com.smartbook.appointment_system.service.BookingService;
import com.smartbook.appointment_system.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/{slotId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> book(@PathVariable Long slotId, Principal principal){
        try {
            Booking booking = bookingService.bookAppointment(slotId, principal.getName());

            notificationService.sendLifecycleNotification(
                    booking.getSlot().getProvider().getEmail(),
                    booking.getUser().getFullName(),
                    booking.getSlot().getProvider().getFullName(),
                    booking.getSlot().getStartTime().toString(),
                    "PENDING"
            );

            return ResponseEntity.ok("Request submitted! Awaiting provider confirmation.");
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long bookingId, @RequestParam String status) {
        try {
            Booking updatedBooking = bookingService.updateBookingStatus(bookingId, status);

            notificationService.sendLifecycleNotification(
                    updatedBooking.getUser().getEmail(),
                    updatedBooking.getUser().getFullName(),
                    updatedBooking.getSlot().getProvider().getFullName(),
                    updatedBooking.getSlot().getStartTime().toString(),
                    updatedBooking.getStatus()
            );

            return ResponseEntity.ok("Booking status updated to: " + updatedBooking.getStatus());
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/provider-requests")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getProviderRequests(Principal principal) {
        try {
            return ResponseEntity.ok(bookingService.getBookingsForProvider(principal.getName()));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/customer-history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getCustomerBookingHistory(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            return ResponseEntity.ok(bookingService.getBookingsForCustomerPaged(principal.getName(), page, size));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}