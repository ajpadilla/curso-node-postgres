This document is where you demonstrate something that many junior and even mid-level developers never explicitly think about:

> Every security mechanism is a tradeoff.

Most people write:

> "I use bcrypt, JWT, and cookies."

A stronger engineer explains:

> "I chose bcrypt because..., JWT because..., httpOnly cookies because..., and here are the risks I accepted."

That's what this document should capture.

---

# Security Decisions

## Overview

Security was not implemented as a single feature, but as a collection of design decisions made throughout the authentication and application architecture.

As the project evolved from a simple CRUD application into a more structured backend system, security concerns became increasingly important.

The goal was not to achieve perfect security, but to adopt practical protections appropriate for a production-oriented learning project.

Current security-related decisions include:

* Password hashing
* JWT authentication
* HTTP-only cookies
* Authentication middleware
* Dependency isolation
* Input validation
* Error handling

Each decision involves benefits, costs, and tradeoffs.

---

# Security Philosophy

The project follows a simple principle:

> Never trust external input.

Every request received by the application is considered untrusted until validated.

Examples:

* Request bodies
* Query parameters
* Route parameters
* Authentication tokens
* Cookies

This principle influences multiple parts of the architecture.

---

# Password Hashing

## Problem

Passwords should never be stored in plain text.

Example:

❌ Dangerous

```text
password = "123456"
```

If the database is compromised, all user passwords become immediately exposed.

---

## Decision

Passwords are hashed using bcrypt.

Flow:

```text
User Password
    ↓
bcrypt
    ↓
Password Hash
    ↓
Database Storage
```

The original password is never stored.

---

## Why bcrypt?

Benefits:

* Industry standard
* Slow by design
* Resistant to brute-force attacks
* Salt generation built in

A slow hash increases the cost of password-cracking attempts.

---

## Tradeoff

Security increases CPU usage.

Example:

```text
Login Request
    ↓
bcrypt Compare
    ↓
CPU Work
```

This creates a performance cost.

In fact, load testing and monitoring later revealed bcrypt as a performance bottleneck under heavy load.

This became the subject of a separate engineering investigation.

---

# JWT-Based Authentication

## Problem

The application must remember authenticated users across requests.

Possible approaches:

* Server-side sessions
* JWT tokens

---

## Decision

The project uses JWT-based authentication.

Flow:

```text
User Login
    ↓
JWT Generated
    ↓
Cookie Stored
    ↓
Future Requests
```

---

## Benefits

* Stateless authentication
* Easier horizontal scaling
* Reduced server-side session storage

The server only verifies the token.

No session data needs to be stored in memory.

---

## Tradeoff

JWTs are harder to revoke.

Once issued:

```text
JWT Valid
    ↓
Request Accepted
```

until expiration.

Immediate invalidation requires additional infrastructure.

Examples:

* token blacklists
* refresh token rotation
* session stores

The project currently accepts this tradeoff for simplicity.

---

# HTTP-Only Cookies

## Problem

The client must store the authentication token somewhere.

Common options:

* localStorage
* sessionStorage
* cookies

---

## Decision

JWTs are stored in HTTP-only cookies.

Flow:

```text
JWT
    ↓
Cookie
    ↓
Browser Storage
```

---

## Benefits

HTTP-only cookies are inaccessible to JavaScript.

This reduces the impact of certain XSS attacks.

Example:

```text
Malicious Script
    ↓
Cannot Read Cookie
```

The browser automatically handles cookie transmission.

---

## Tradeoff

Cookies introduce additional concerns:

* CSRF protection
* SameSite configuration
* Secure flags

Security improves in one area while creating new considerations elsewhere.

---

# Authentication Middleware

## Problem

Protected routes must verify user identity.

Example:

```text
GET /users/me
```

should not be accessible by anonymous users.

---

## Decision

Authentication is enforced through middleware.

Flow:

```text
Request
    ↓
JWT Middleware
    ↓
User Verified
    ↓
Protected Route
```

---

## Benefits

* Centralized security enforcement
* Reduced duplicated logic
* Consistent protection

Routes do not need to implement authentication repeatedly.

---

## Tradeoff

Additional complexity is introduced into request processing.

However, consistency outweighs the cost.

---

# Input Validation

## Problem

Users may send invalid or malicious data.

Examples:

* Missing fields
* Incorrect formats
* Unexpected values

---

## Decision

Incoming data is validated before reaching business logic.

Flow:

```text
Request
    ↓
Validation Middleware
    ↓
Business Logic
```

Invalid requests are rejected early.

---

## Benefits

* Reduced attack surface
* Better error messages
* More predictable application behavior

---

## Tradeoff

Validation requires additional schemas and maintenance effort.

However, this cost is generally much lower than debugging invalid data later.

---

# Error Handling Strategy

## Problem

Unexpected errors can expose internal implementation details.

Example:

```text
Database Connection Error
Stack Trace
SQL Details
```

Returning this information to users creates security risks.

---

## Decision

Errors are mapped into controlled HTTP responses.

Flow:

```text
Application Error
    ↓
Error Mapper
    ↓
Safe HTTP Response
```

---

## Benefits

* Reduced information leakage
* Consistent responses
* Better client experience

---

## Tradeoff

Debugging becomes more dependent on logs because internal details are intentionally hidden from clients.

---

# Dependency Isolation

## Problem

Business logic should not depend directly on infrastructure implementations.

Examples:

* bcrypt
* Sequelize
* JWT libraries

---

## Decision

Dependencies are accessed through abstractions.

Example:

```text
AuthService
    ↓
PasswordHasher Interface
    ↓
BcryptPasswordHasher
```

---

## Benefits

* Easier testing
* Reduced coupling
* Safer future migrations

Infrastructure changes remain isolated.

---

## Tradeoff

Additional abstractions increase architectural complexity.

The project accepts this cost to improve maintainability and testability.

---

# Current Security Limitations

The current implementation intentionally prioritizes learning and architectural understanding.

Several security features could be improved.

Examples:

* Refresh token rotation
* Session revocation
* Multi-factor authentication
* Account lockout policies
* Rate limiting
* Password reset expiration
* Security headers
* Audit logging

These are common features in production systems.

---

# Security Evolution

The security model evolved gradually.

### Phase 1

```text
Password
    ↓
Database
```

Minimal protection.

---

### Phase 2

```text
Password
    ↓
bcrypt
    ↓
Database
```

Password security introduced.

---

### Phase 3

```text
Authentication
    ↓
JWT
    ↓
Protected Routes
```

Session management introduced.

---

### Phase 4

```text
Validation
Authentication
Error Handling
Monitoring
```

Security concerns became distributed throughout the architecture.

---

# Lessons Learned

Building authentication and security features introduced several important concepts:

* Defense in depth
* Authentication vs authorization
* Stateless sessions
* Password hashing
* Secure token handling
* Security tradeoffs
* Risk management

Perhaps the most important lesson was understanding that security is rarely about a single mechanism.

Instead, security emerges from multiple layers working together.

---

# Summary

The project's security design combines:

* bcrypt password hashing
* JWT authentication
* HTTP-only cookies
* authentication middleware
* request validation
* centralized error handling

These decisions improve the security posture of the application while balancing simplicity, maintainability, and operational complexity.

More importantly, the project demonstrates an evolution from basic CRUD functionality toward a system that explicitly considers security risks, architectural boundaries, and long-term maintainability.
