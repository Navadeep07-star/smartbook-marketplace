package com.smartbook.appointment_system.service;

import com.smartbook.appointment_system.model.Booking;
import com.smartbook.appointment_system.model.Slot;
import com.smartbook.appointment_system.model.User;
import com.smartbook.appointment_system.repository.BookingRepository;
import com.smartbook.appointment_system.repository.SlotRepository;
import com.smartbook.appointment_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;



   @Transactional
    public Booking bookAppointment(Long slotId, String userEmail){

        Slot slot = slotRepository.findByIdWithLock(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if(!slot.isAvailable()){
            throw new RuntimeException("This slot is already booked!");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findBySlotId(slotId)
                .orElse(new Booking()); 

        slot.setAvailable(false);
        slotRepository.save(slot);

        booking.setSlot(slot);
        booking.setUser(user);
        booking.setBookingTime(LocalDateTime.now());
        booking.setAmount(100.0);
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);

        try {
            notificationService.sendLifecycleNotification(
                    slot.getProvider().getEmail(),
                    user.getFullName(),
                    slot.getProvider().getFullName(),
                    slot.getStartTime().toString(),
                    "PENDING"
            );
        } catch (Exception e) {
            System.err.println("Non-blocking email failure during slot booking: " + e.getMessage());
        }

        return savedBooking;
    }
    
    @Transactional
    public Booking updateBookingStatus(Long bookingId, String newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking record not found"));

        Slot slot = booking.getSlot();
        User user = booking.getUser();

        if ("ACCEPTED".equalsIgnoreCase(newStatus)) {
            booking.setStatus("ACCEPTED");
            slot.setAvailable(false);
        }
        else if ("REJECTED".equalsIgnoreCase(newStatus)) {
            booking.setStatus("REJECTED");
            slot.setAvailable(true);
        }

        slotRepository.save(slot);
        Booking savedBooking = bookingRepository.save(booking);
        try {
            notificationService.sendLifecycleNotification(
                    user.getEmail(),
                    user.getFullName(),
                    slot.getProvider().getFullName(),
                    slot.getStartTime().toString(),
                    newStatus
            );
        } catch (Exception e) {
            System.err.println("Non-blocking email failure during status update: " + e.getMessage());
        }

        return savedBooking;
    }

    public List<Booking> getBookingsForProvider(String providerEmail) {
        System.out.println("🔍 Fetching active marketplace requests for provider: " + providerEmail);
        return bookingRepository.findBySlotProviderEmail(providerEmail);
    }
    public List<Booking> getBookingsForCustomer(String customerEmail) {
        System.out.println("🔍 Fetching historical booking ledger for customer: " + customerEmail);
        return bookingRepository.findByUserEmail(customerEmail);
    }
    public Page<Booking> getBookingsForCustomerPaged(String customerEmail, int page, int size) {
        System.out.println("🔍 Querying chunked database records for customer: " + customerEmail + " | Page: " + page);


        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("bookingTime").descending());

        return bookingRepository.findByUserEmail(customerEmail, pageRequest);
    }
}
