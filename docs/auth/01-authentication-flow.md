# Authentication Flow

## Overview

The authentication system is responsible for validating user credentials and generating a JWT token for authenticated sessions.

The design evolved from a simple CRUD-style implementation into a more modular architecture focused on:

* separation of concerns
* testability
* dependency isolation
* production readiness

---

## Authentication Request Flow

### Login Flow

Endpoint:

POST /api/v1/auth/login

Request lifecycle:

Client
↓
AuthRouter
↓
Passport Local Strategy
↓
AuthService.authenticate()
↓
UserRepository.findByEmail()
↓
PasswordHasher.compare()
↓
Authenticated User
↓
AuthService.signToken()
↓
JWT Cookie Response

Successful response:

* JWT token generated
* `access_token` cookie created
* authenticated session established

Failure response:

* invalid email → UnauthorizedError
* invalid password → UnauthorizedError
* unexpected errors → centralized error middleware

---

## System Responsibilities

### AuthRouter

Responsible for:

* exposing HTTP endpoints
* delegating authentication
* setting authentication cookies

Why?

Routes should coordinate requests, not contain business logic.

---

### Passport Local Strategy

Responsible for:

* validating credentials before route execution
* attaching authenticated user to `req.user`

Why?

Authentication concerns remain reusable and isolated.

Without Passport, authentication logic would leak into route handlers.

---

### AuthService

Responsible for:

* validating credentials
* comparing passwords
* signing JWT tokens
* verifying tokens

Important design decision:

The service contains business logic and is independent from Express.

This improves:

* testability
* reuse
* separation of concerns

---

### UserRepository

Responsible for:

* retrieving users from persistence

Production implementation:

* SequelizeUserRepository

Testing implementation:

* InMemoryUserRepository

Why?

Business logic should not depend directly on Sequelize.

---

### PasswordHasher

Responsible for:

* hashing passwords
* password comparison

Production:

* bcrypt

Testing:

* FakePasswordHasher

Why?

bcrypt is CPU intensive and unnecessary for fast unit tests.

---

## Evolution of the Design

### Phase 1 — Simple CRUD Authentication

Initial implementation prioritized speed.

Responsibilities were tightly coupled:

Route
↓
Database Query
↓
Password Validation
↓
JWT Creation
↓
Response

Problems discovered:

* difficult to test
* coupled to HTTP framework
* authentication logic mixed with infrastructure
* hard dependency replacement

Tradeoff:

Simple and fast to implement.

Good for validating functionality early.

---

### Phase 2 — Service Extraction

Authentication logic moved into `AuthService`.

Benefits:

* business logic isolated
* easier testing
* reusable authentication rules

Tradeoff:

More abstractions and files.

---

### Phase 3 — Dependency Injection

Dependencies became injectable through bootstrap.

Production:

* SequelizeUserRepository
* BcryptPasswordHasher

Testing:

* InMemoryUserRepository
* FakePasswordHasher

Benefits:

* infrastructure independence
* fast isolated tests
* flexible dependency replacement

Tradeoff:

Higher bootstrap complexity.

---

## Engineering Tradeoffs

| Decision             | Benefit                 | Cost                      |
| -------------------- | ----------------------- | ------------------------- |
| AuthService          | better separation       | more abstraction          |
| Passport             | reusable authentication | added complexity          |
| Dependency Injection | replace dependencies    | harder setup              |
| Fake repositories    | fast tests              | less realistic            |
| bcrypt               | secure passwords        | CPU intensive             |
| JWT cookie           | stateless auth          | harder token invalidation |

---

## Testing Strategy

The authentication system is validated at multiple layers.

### Unit Tests

Goal:

Validate business logic in isolation.

Example:

AuthService
↓
FakePasswordHasher
↓
InMemoryUserRepository

Why?

Fast feedback without database dependency.

---

### Integration Tests

Goal:

Validate repository behavior with real infrastructure.

Example:

Sequelize + PostgreSQL

Why?

Ensure persistence behaves correctly.

---

### End-to-End Tests

Goal:

Validate complete authentication lifecycle.

Flow:

HTTP Request
↓
Middleware
↓
Route
↓
Service
↓
Persistence
↓
HTTP Response

Example:

POST /api/v1/auth/login

---

## Security Considerations

Passwords are hashed using bcrypt.

JWT tokens are stored using httpOnly cookies.

Benefits:

* reduced JavaScript access to tokens
* reduced XSS exposure

JWT payload:

* `sub` → user id
* `role` → authorization role

---

## Future Improvements

Potential future improvements:

* refresh token rotation
* rate limiting
* account lockout protection
* session invalidation strategy
* OAuth providers
* distributed session revocation
