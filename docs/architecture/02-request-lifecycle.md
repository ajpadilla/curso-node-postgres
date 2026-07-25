# Request Lifecycle

## Overview

Every HTTP request travels through multiple layers before a response is returned to the client.

Rather than placing all responsibilities inside route handlers, this project separates concerns into middleware, application services, domain abstractions, and infrastructure components.

Understanding this lifecycle is essential because it explains how different parts of the application collaborate to process a request.

The goal is to make each layer responsible for a single concern while keeping business logic independent from HTTP and infrastructure details.

---

# High-Level Request Flow

A typical request follows this path:

```text
Client
    ↓
Express Application
    ↓
Security Middleware
    ↓
Observability Middleware
    ↓
Authentication Middleware
    ↓
Router
    ↓
Application Service
    ↓
Repository
    ↓
PostgreSQL
    ↓
Application Service
    ↓
HTTP Response
```

Each component has a specific responsibility.

---

# 1. Client Request

The lifecycle begins when a client sends an HTTP request.

Example:

```http
POST /api/v1/users
```

The request contains:

* HTTP method
* URL
* Headers
* Cookies
* Request body

At this point the application does not trust any incoming data.

---

# 2. Express Application

The Express application receives the request and initializes the middleware pipeline.

Responsibilities include:

* parsing JSON
* registering middleware
* registering routes
* forwarding requests

The application itself contains very little business logic.

Instead, it coordinates the request lifecycle.

---

# 3. Security Middleware

Security middleware executes before business logic.

Typical responsibilities include:

* parsing cookies
* validating JWT tokens
* protecting authenticated routes
* preparing security context

Example:

```text
Request
    ↓
Cookie Parser
    ↓
JWT Authentication
```

If authentication fails, the request ends here with an appropriate HTTP response.

---

# 4. Observability Middleware

Before reaching business logic, the request is instrumented.

Current middleware includes:

* Request ID generation
* HTTP logging
* Metrics collection

Flow:

```text
Request
    ↓
Request ID
    ↓
Logger
    ↓
Metrics
```

This allows every request to be traced throughout the application.

---

# 5. Route Resolution

Once middleware completes successfully, Express selects the appropriate router.

Example:

```http
POST /api/v1/auth/login
```

↓

```text
AuthRouter
```

Routes have a simple responsibility:

* receive requests
* validate input
* delegate work

Business rules are intentionally kept outside the router.

---

# 6. Request Validation

Before executing business logic, incoming data is validated.

Examples:

* required fields
* email format
* password rules

Invalid requests are rejected before reaching application services.

Benefits:

* predictable inputs
* reduced error handling
* improved security

---

# 7. Application Services

Application services coordinate business use cases.

Examples:

* AuthService
* UserService

Responsibilities include:

* enforcing business rules
* coordinating repositories
* coordinating security services
* returning business results

Importantly, services do not know anything about Express.

They receive data and return results independently of HTTP.

This separation improves testability and maintainability.

---

# 8. Infrastructure Layer

When business logic requires external resources, services delegate work through abstractions.

Examples:

```text
UserService
    ↓
UserRepository
    ↓
SequelizeUserRepository
    ↓
PostgreSQL
```

Other infrastructure services include:

* PasswordHasher
* TokenService
* Mailer

This keeps business logic independent from implementation details.

---

# 9. Database Interaction

Repositories are responsible for persistence.

Typical operations include:

* create user
* retrieve user
* update user
* delete user

Repositories translate business requests into database operations while hiding ORM details from the application layer.

---

# 10. Returning Results

Once business logic completes successfully:

Application Service

↓

Router

↓

Express Response

↓

Client

The router converts business results into HTTP responses.

Example:

```http
HTTP/1.1 201 Created

{
  "id": 25,
  "email": "john@example.com"
}
```

---

# Error Flow

Not every request completes successfully.

Errors follow a separate lifecycle.

```text
Application Error
        ↓
Async Handler
        ↓
Error Mapper
        ↓
Error Middleware
        ↓
HTTP Response
```

Instead of handling errors inside every controller, the project centralizes error processing.

Benefits:

* consistent responses
* reduced duplication
* easier maintenance

---

# Cross-Cutting Concerns

Several components participate in every request regardless of the endpoint.

Examples:

### Logging

Every request receives a unique Request ID.

This allows related log entries to be correlated.

---

### Metrics

Request duration and status codes are collected for Prometheus.

These metrics support monitoring and performance analysis.

---

### Authentication

Protected routes validate JWT tokens before executing business logic.

Authentication remains independent from individual route handlers.

---

# Design Principles

Several architectural principles influenced the request lifecycle.

## Separation of Concerns

Each layer has a clearly defined responsibility.

Examples:

* Router → HTTP
* Service → Business Logic
* Repository → Persistence

---

## Dependency Inversion

Application services depend on abstractions rather than concrete implementations.

Example:

```text
AuthService
    ↓
UserRepository Interface
    ↓
SequelizeUserRepository
```

This makes infrastructure replaceable during testing.

---

## Single Responsibility

Each component focuses on one concern.

For example:

* Logger → logging
* Metrics Middleware → metrics
* PasswordHasher → password hashing

Responsibilities remain isolated.

---

## Observability

Every request should leave evidence.

Current implementation provides:

* request identifiers
* logs
* metrics
* health checks

This simplifies debugging and operational monitoring.

---

# Example: User Registration Request

The complete lifecycle for creating a new user is shown below.

```text
Client
    ↓
POST /api/v1/users
    ↓
Express
    ↓
Request ID Middleware
    ↓
Logging Middleware
    ↓
Metrics Middleware
    ↓
Validation Middleware
    ↓
Users Router
    ↓
UserService
    ↓
PasswordHasher
    ↓
UserRepository
    ↓
PostgreSQL
    ↓
User Created
    ↓
HTTP 201 Created
```

This example illustrates how responsibilities remain separated while collaborating to complete a single business operation.

---

# Summary

The request lifecycle describes how an HTTP request moves through the application's architecture, from the moment it enters the Express server until a response is returned.

By separating middleware, routing, business logic, persistence, and infrastructure concerns, the project achieves:

* better maintainability
* improved testability
* clearer architectural boundaries
* stronger observability
* easier long-term evolution

Rather than concentrating all logic in controllers, each layer contributes a focused responsibility, allowing the application to remain modular and easier to understand as it grows.
