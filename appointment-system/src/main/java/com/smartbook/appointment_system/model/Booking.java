package com.smartbook.appointment_system.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @OneToOne
    private Slot slot;

    private LocalDateTime bookingTime;


    private String status;

    private  Double amount;
}
