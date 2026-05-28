package com.smartbook.appointment_system.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendRealEmail(String toEmail, String subject, String bodyText) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(bodyText);
        message.setFrom("no-reply@smartbook.com");

        mailSender.send(message);
    }

    @Async
    public void sendBookingConfirmationEmail(String customerEmail, String providerName, String startTime) {
        System.out.println("🧵 Background Thread [" + Thread.currentThread().getName() + "] started processing email pipeline...");

        try {

            Thread.sleep(3000);

            System.out.println("\n------------------------------------------------------------");
            System.out.println("📧 INCOMING EMAIL DISPATCH LOG:");
            System.out.println("TO: " + customerEmail);
            System.out.println("SUBJECT: SmartBook Reservation Confirmed!");
            System.out.println("BODY: Dear Customer, your booking with " + providerName + " scheduled for " + startTime + " is confirmed.");
            System.out.println("------------------------------------------------------------\n");

        } catch (InterruptedException e) {
            System.err.println("Notification thread worker interrupted: " + e.getMessage());
        }
    }

    @Async
    public void sendLifecycleNotification(String targetEmail, String customerName, String providerName, String startTime, String status) {
        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setTo(targetEmail);


            helper.setFrom("navadeeponline@gmail.com", "SmartBook Marketplace");

            String subject = "";
            String bodyText = "";

            switch (status.toUpperCase()) {
                case "PENDING":
                    subject = "SmartBook: New Appointment Request Action Required";
                    bodyText = "Hello " + providerName + ",\n\n" +
                            "Customer " + customerName + " has requested an appointment slot on " + startTime + ".\n" +
                            "Please log into your merchant dashboard to Accept or Reject this request.\n\n" +
                            "Best regards,\nSmartBook Team";
                    break;

                case "ACCEPTED":
                    subject = "SmartBook Appointment Confirmed! 🎉";
                    bodyText = "Great news " + customerName + "!\n\n" +
                            "Your appointment request with " + providerName + " scheduled for " + startTime + " has been officially ACCEPTED.\n\n" +
                            "Thank you for choosing SmartBook!";
                    break;

                case "REJECTED":
                    subject = "SmartBook: Update Regarding Your Booking Request";
                    bodyText = "Hello " + customerName + ",\n\n" +
                            "Unfortunately, your appointment request with " + providerName + " scheduled for " + startTime + " was declined.\n" +
                            "The slot has been released back into the marketplace directory.\n\n" +
                            "Best regards,\nSmartBook Team";
                    break;
            }

            helper.setSubject(subject);
            helper.setText(bodyText);


            mailSender.send(mimeMessage);
            System.out.println("🚀 Real email successfully dispatched with premium display names to: " + targetEmail);

        } catch (Exception e) {
            System.err.println("❌ Failure routing SMTP package: " + e.getMessage());
        }
    }
}