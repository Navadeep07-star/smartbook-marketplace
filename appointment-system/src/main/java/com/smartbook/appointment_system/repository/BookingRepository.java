package com.smartbook.appointment_system.repository;

import com.smartbook.appointment_system.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findBySlotProviderEmail(String email);
    List<Booking> findByUserEmail(String email);
    Page<Booking> findByUserEmail(String email, Pageable pageable);

}
