package com.smartbook.appointment_system.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Async
    public void sendBookingConfirmation(String toEmail, String recipientName, String slotTime) {
        System.out.println("==========================================================");
        System.out.println("ASYNC THREAD NOTIFICATION ENGINE STARTED");
        System.out.println("Active Background Thread: " + Thread.currentThread().getName());
        System.out.println("Simulating Email Dispatch to: " + toEmail);
        System.out.println("Message: Hello " + recipientName + ", your appointment for " + slotTime + " is confirmed!");
        System.out.println("==========================================================");
    }
}