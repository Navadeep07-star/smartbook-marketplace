# SmartBook | Multi-Service Resource Scheduling Hub

SmartBook is a full-stack web application built to connect customers with independent service merchants (such as medical staff, mechanics, electricians, and technicians). It provides real-time slot selection, a categorized service directory, role-based access control, and transactional booking flows.

---

## 🏗️ System Architecture & Data Flow

The platform follows a decoupled client-server architecture:

1. **Client Layer (React.js):** Manages UI state, handles JWT authentication storage, intercepts API requests with Axios, and dynamically renders routes based on user roles.
2. **Application Core (Spring Boot):** Enforces core business logic, handles ORM mapping via JPA/Hibernate, secures endpoints using Spring Security, and manages background notification tasks.
3. **Relational Database Engine (PostgreSQL / MySQL):** Maintains persistent entities, foreign key constraints, indexes, and transactional data integrity during slot reservations.

---

## ⚡ Core Technical Features

* **Role-Based Access Control:** Secured with Spring Security and JWT. Supports distinct dashboards and authorization scopes for Customers, Providers, and Admins.
* **Automated Data Seeding:** Uses a Spring Boot `CommandLineRunner` to seed essential database roles (`ROLE_USER`, `ROLE_PROVIDER`, `ROLE_ADMIN`) on application startup if missing.
* **Server-Side Pagination:** Uses Spring Data JPA `Pageable` requests to chunk and fetch historical reservation records efficiently.
* **Asynchronous Email Processing:** Dispatches booking confirmation receipts on background thread pools to prevent blocking main HTTP request execution.
* **Simulated Checkout Flow:** Includes a modal-based payment confirmation step to mimic real-world booking clearance workflows.

---

## 🛠️ Tech Stack & Tooling

* **Backend Development:** Java 21, Spring Boot 3, Spring Data JPA, Spring Security, Hibernate
* **Frontend Development:** React.js, Axios, Lucide Icons, Custom CSS Modules
* **Database Management:** PostgreSQL (Production on Render), MySQL 8.0 (Local Development)
* **Protocols & Auth:** RESTful APIs, JSON Web Tokens (JWT)
* **Hosting & DevOps:** Render (Web Service & Managed PostgreSQL)

