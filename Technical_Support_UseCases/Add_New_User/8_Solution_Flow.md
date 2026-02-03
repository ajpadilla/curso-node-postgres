# Add New User - Solution Flow

---

## 1. Problem Summary

The initial implementation of `UserService.create` was tightly coupled
to infrastructure and external libraries, making the service difficult
to test, maintain, and extend.

Several hidden dependencies and ORM-specific behaviors were present,
violating SOLID principles.

---

## 2. Initial Implementation Issues

### 2.1 Infrastructure Coupling

The service directly depended on:

- Sequelize ORM
- bcrypt library
- Sequelize model attributes

Example:

```js
sequelize.models.User.create(...)
bcrypt.hash(...)
newUser.dataValues.password 
```


This violated the Dependency Inversion Principle.

### 2.2 Low Testability

Because of direct dependencies:

Unit tests required real database setup

Password hashing was slow and hard to mock

ORM-specific attributes leaked into domain logic

This made isolated testing difficult.

### 2.3 Domain Pollution

Business logic was mixed with:

Persistence logic

Hashing logic

ORM internal structures

This reduced separation of concerns.

## 3. Detection Process

The problems were identified through:

Unit testing attempts

Mocking difficulties

Unexpected ORM behavior

Manual debugging

A fake-based test was created:

user.service.fake.unit.test.js


Using:

InMemoryUserRepository

FakePasswordHasher

This exposed tight coupling and hidden dependencies.

## 4. Refactoring Strategy

The refactor followed these principles:

4.1 Apply Dependency Inversion

External dependencies were injected:

UserRepository

PasswordHasher

constructor(userRepository, passwordHasher)

### 4.2 Abstract Infrastructure

ORM and bcrypt were removed from the domain layer.

They were replaced by interfaces and adapters.

### 4.3 Centralize Validation

Input validation was moved to the service:

if (!data.email) {
  throw new ValidationError(...)
}

### 4.4 Remove ORM-Specific Logic

The use of dataValues was eliminated.

Repositories now return plain objects.

## 5. Final Architecture

After refactoring:

UserService
   ↓
UserRepository (interface)
   ↓
Infrastructure Adapter (Sequelize / InMemory)

UserService
   ↓
PasswordHasher (interface)
   ↓
bcrypt / fake implementation


The service now depends only on abstractions.

## 6. Testing Strategy

Fake implementations were introduced:

InMemoryUserRepository

FakePasswordHasher

Test flow:

Service receives dependencies

Password is hashed via fake

User is stored in memory

Output is verified

Example:

expect(user.password).toBeUndefined();


This allows fast and isolated tests.

## 7. Lessons Learned
### 7.1 Dependency Injection Improves Testability

Injecting dependencies enables:

Easier mocking

Faster tests

Better isolation

### 7.2 Infrastructure Must Not Leak

ORM-specific details should never appear
in domain or application services.

### 7.3 Tests Reveal Architecture Problems

Testing exposed hidden couplings and design flaws.

Tests acted as architectural validation.

### 7.4 Separation of Concerns Is Essential

Each layer now has a clear responsibility:

Service: business rules

Repository: persistence

Hasher: encryption

Infrastructure: implementation

## 8. Future Improvements

Add explicit conflict detection

Add schema validation layer

Add logging middleware

Add monitoring for infrastructure failures
