# Testing Strategy

## Overview

This project uses a layered testing strategy designed to validate the system at different levels of confidence.

The goal is not to rely on a single type of test, but to combine multiple testing layers that provide fast feedback during development while still validating real production behavior.

The testing pyramid used by this project consists of:

1. Unit Tests
2. Integration Tests
3. End-to-End Tests
4. UI End-to-End Tests

Each layer answers a different engineering question.

---

## Testing Philosophy

Different bugs appear at different levels of the system.

A business rule bug can be detected without a database.

A database mapping bug requires real persistence.

A routing bug requires a complete HTTP request.

A browser interaction bug requires a real browser.

For this reason, the project uses multiple testing layers instead of relying exclusively on one testing style.

---

# Unit Tests

## Goal

Validate business logic in isolation.

Unit tests focus on a single component and replace external dependencies using fakes or mocks.

Typical examples:

* AuthService
* UserService

Example flow:

AuthService
↓
FakePasswordHasher
↓
InMemoryUserRepository

No database.

No Express server.

No HTTP requests.

The objective is to verify business behavior quickly and deterministically.

---

## Example

Authentication validation:

* user exists
* password is correct
* authenticated user is returned

The test verifies business rules without requiring PostgreSQL or bcrypt.

This keeps tests extremely fast.

---

## Benefits

* Fast execution
* Easy debugging
* Isolated failures
* Encourages dependency injection

---

## Tradeoffs

Unit tests cannot verify:

* database mappings
* SQL queries
* HTTP routing
* middleware integration

Passing unit tests do not guarantee the complete system works.

---

# Integration Tests

## Goal

Validate collaboration between application code and infrastructure.

These tests verify that real implementations behave correctly when connected together.

Examples:

* SequelizeUserRepository
* PostgreSQL integration
* Persistence behavior

Example flow:

UserService
↓
SequelizeUserRepository
↓
PostgreSQL

Unlike unit tests, these tests interact with real infrastructure.

---

## Why Integration Tests Exist

A repository may satisfy its interface while still containing:

* invalid queries
* incorrect mappings
* persistence bugs

Integration tests detect these problems.

---

## Benefits

* Validates real infrastructure
* Detects persistence issues
* Increases confidence before deployment

---

## Tradeoffs

* Slower than unit tests
* More setup required
* Depends on external services

---

# End-to-End Tests

## Goal

Validate complete request lifecycle behavior.

These tests simulate real client requests against the application.

Example flow:

HTTP Request
↓
Express Route
↓
Middleware
↓
Service
↓
Repository
↓
Database
↓
HTTP Response

Examples:

* User creation
* Login requests

The objective is to verify that all layers work together correctly.

---

## Benefits

* High confidence
* Detects routing issues
* Detects middleware issues
* Detects integration failures

---

## Tradeoffs

* Slower execution
* More difficult debugging
* More infrastructure required

---

# UI End-to-End Tests

## Goal

Validate user behavior from a browser perspective.

These tests use Playwright to automate real browser interactions.

Example:

User
↓
Login Form
↓
Authentication Request
↓
Cookie Creation
↓
Dashboard Redirect

The objective is to validate the experience exactly as a user would.

---

## Benefits

* Validates complete user journey
* Detects UI regressions
* Detects frontend/backend integration issues

---

## Tradeoffs

* Slowest test layer
* More fragile
* Requires browser automation

---

# Testing Toolkit

To simplify test creation, the project includes reusable testing utilities.

## UserBuilder

Creates valid user objects with sensible defaults.

Benefits:

* Less duplicated setup
* More readable tests

Example:

UserBuilder.aUser()
.withEmail('[test@test.com](mailto:test@test.com)')
.build()

---

## InMemoryUserRepository

In-memory implementation of UserRepository.

Used by unit tests to avoid database dependencies.

Benefits:

* Fast execution
* Deterministic behavior
* Infrastructure independence

---

## FakePasswordHasher

Testing implementation of PasswordHasher.

Allows business logic testing without bcrypt.

Benefits:

* Faster tests
* No CPU-intensive hashing

---

## Fixtures

Predefined datasets used to create repeatable test scenarios.

Benefits:

* Consistent test data
* Reduced setup code

---

# Why Dependency Injection Matters

The testing strategy depends heavily on dependency injection.

Production dependencies:

* SequelizeUserRepository
* BcryptPasswordHasher

Testing dependencies:

* InMemoryUserRepository
* FakePasswordHasher

Because services depend on abstractions instead of concrete implementations, infrastructure can be replaced during tests without changing business logic.

This significantly improves testability.

---

# Current Testing Structure

test/

├── unit/
├── integration/
├── e2e/
├── e2e-ui/
└── toolkit/

Each directory represents a different confidence level and testing scope.

Together they provide coverage from isolated business logic to complete user interactions.

---

# Future Improvements

Potential future additions:

* Contract testing
* Performance testing automation
* Mutation testing
* Test coverage reporting
* CI/CD automated test execution

The current strategy already provides strong confidence across business logic, infrastructure, HTTP flows, and user-facing behavior.
