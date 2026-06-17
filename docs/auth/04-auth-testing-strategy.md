# Testing Strategy

The project uses multiple testing layers to validate behavior at different levels.

## Unit Tests

Goal:

Test isolated business logic.

Examples:

* AuthService
* UserService

Dependencies are replaced using fakes or mocks.

Example:

AuthService
↓
FakePasswordHasher
↓
InMemoryUserRepository

Why?

Unit tests should run fast and avoid database dependencies.

---

## Integration Tests

Goal:

Validate real infrastructure behavior.

Examples:

* SequelizeUserRepository
* PostgreSQL integration

Why?

To ensure repository implementations work correctly with the database.

---

## End-to-End Tests

Goal:

Validate complete request lifecycle.

Flow:

HTTP Request
↓
Express Route
↓
Middleware
↓
Service
↓
Database
↓
HTTP Response

Example:

POST /users

---

## UI End-to-End Tests

Goal:

Validate browser behavior.

Tool:

Playwright

Example:

Login flow

User
↓
Form submission
↓
Authentication
↓
Dashboard redirect

---

## Testing Toolkit

Custom test utilities improve consistency.

Includes:

* UserBuilder
* InMemoryRepository
* FakePasswordHasher
* Fixtures

Benefits:

* Less duplicated setup
* More readable tests
* Better isolation
