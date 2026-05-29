# SmartBook | Multi-Service Resource Scheduling Hub

SmartBook is a full-stack distributed web application designed to bridge the gap between service customers and independent service merchants (such as medical staff, automotive mechanics, electricians, and technicians). The platform provides real-time availability tracking, transparent multi-sector directories, and transactional booking lifecycle flows.

---

## 🏗️ System Architecture & Data Flow

The platform is designed around a decoupled, single-page client architecture that interacts seamlessly with a secure, transactional REST API backend.


1. **Client Layer Layer (React.js):** Functions as a reactive state engine. It manages JWT state scopes, intercepts secure API requests, handles routing variations, and maps dynamic database records efficiently.
2. **Application Core Layer (Spring Boot):** Enforces business logic layers, executes object-relational mapping (JPA/Hibernate), filters security parameters using Spring Security filters, and processes asynchronous execution pools.
3. **Relational Database Engine (MySQL):** Handles persistent relational entities, mapping constraints, left-join queries, and transactional data integrity during bookings.

---

## ⚡ Core Technical Features 

* **Role-Based Security Control:** Fully secure environment powered by Spring Security and stateful JSON Web Tokens (JWT). Differentiates between Customer nodes and Merchant nodes to route access dashboards dynamically.
* **Server-Side Database Pagination:** Leverages Spring Data JPA Repository page indexing to stream historical reservation records into chunks, drastically optimizing memory lookup scales.
* **Asynchronous Notification Thread Pools:** Backend operations use asynchronous multi-threading routines to dispatch system confirmation receipts without locking main HTTP request execution paths.
* **Simulated Checkout Gateway Architecture:** Implements a realistic front-facing payment clearance modal that mimics tokenized B2C payment structures while maintaining enterprise safety principles.

---

## 🛠️ Tech Stack & Tooling

* **Backend Development Engine:** Java 21, Spring Boot 3, Spring Data JPA, Spring Security, Hibernate
* **Frontend Web Framework:** React.js, Axios Client, Lucide React Icon Pack, Custom CSS3 Modules
* **Relational Database Management System:** MySQL 8.0 Engine
* **Communication & Protocols:** RESTful API Architecture, JSON Web Tokens (JWT)

---

## ⚙️ Local Development Environment Setup

### ☕ Prerequisites
* Java Development Kit (JDK 21) installed
* Node.js (v20+ runtimes) installed
* MySQL Server instance active on port `3306`

### 🏃 Running the Platform

#### 1. Database Init
Create a local schema instance inside your MySQL terminal console:
```sql
CREATE DATABASE smart_booking_db;