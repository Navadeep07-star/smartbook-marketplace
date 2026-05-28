package com.smartbook.appointment_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "slot",indexes = {
        @Index(name = "idx_start_time", columnList = "start_time"),
        @Index(name = "idx_available", columnList = "available")
        })
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean available = true;

    @ManyToOne
    @JoinColumn(name = "provider_id",nullable = false)
    private User provider;



}
