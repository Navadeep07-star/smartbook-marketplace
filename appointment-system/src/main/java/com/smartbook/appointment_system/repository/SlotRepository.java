package com.smartbook.appointment_system.repository;import com.smartbook.appointment_system.model.Slot;

import com.smartbook.appointment_system.model.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<Slot,Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdWithLock(Long id);
    List<Slot> findByProviderIdAndAvailableTrue(Long providerId);
    List<Slot> findByAvailableTrue();
    boolean existsByProviderAndStartTime(User provider, LocalDateTime startTime);
    List<Slot> findByAvailableTrueAndStartTimeBetween(LocalDateTime start,LocalDateTime end);

}
