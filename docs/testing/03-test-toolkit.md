# Test Toolkit

## Overview

As the project evolved, test scenarios became more complex.

Creating users, repositories, fixtures, and supporting objects repeatedly inside every test increased duplication and reduced readability.

To solve this problem, the project includes a dedicated testing toolkit.

The toolkit provides reusable testing utilities that help:

* reduce duplicated setup code
* improve test readability
* standardize test data
* simplify test maintenance
* encourage consistent testing patterns

The toolkit lives under:

test/toolkit/

and is shared across unit, integration, and end-to-end tests.

---

# Why a Testing Toolkit Exists

Without reusable testing utilities, tests often become difficult to read.

Example:

const passwordHasher = new FakePasswordHasher();

const userRepository = new InMemoryUserRepository({
users: [
{
id: 1,
email: '[test@test.com](mailto:test@test.com)',
password: 'hashed(123)',
role: 'user',
},
],
});

The actual business behavior becomes hidden inside setup code.

As the codebase grows, this problem becomes more noticeable.

The testing toolkit separates:

* test setup
* test behavior

allowing tests to focus on the behavior being validated.

---

# Toolkit Structure

Current toolkit structure:

toolkit/

├── builders/
├── fakes/
├── fixtures/
└── index.js

Each category serves a different purpose.

---

# Builders

## Purpose

Builders create valid objects with sensible defaults.

Instead of manually constructing objects in every test, builders provide a fluent API for generating test data.

Current implementation:

UserBuilder

---

## Example

Without Builder

const user = {
email: '[test@test.com](mailto:test@test.com)',
password: '123456',
};

With Builder

UserBuilder
.aUser()
.withEmail('[test@test.com](mailto:test@test.com)')
.withPassword('123456')
.build();

Benefits:

* Improved readability
* Reduced duplication
* Easier future changes

---

## Why Faker Is Used

The builder uses Faker to generate realistic values.

Example:

* emails
* passwords
* names

Benefits:

* More realistic scenarios
* Less hardcoded data
* Reduced risk of duplicated values

---

# Fakes

## Purpose

Fakes replace infrastructure dependencies during tests.

Unlike mocks, fakes contain working behavior.

Current fakes:

* InMemoryUserRepository
* FakePasswordHasher
* InMemoryStore

---

## InMemoryUserRepository

Purpose:

Replace PostgreSQL during unit tests.

Production:

UserService
↓
SequelizeUserRepository
↓
PostgreSQL

Testing:

UserService
↓
InMemoryUserRepository
↓
Memory

Benefits:

* Faster execution
* No database dependency
* Better isolation

---

## FakePasswordHasher

Purpose:

Replace bcrypt during unit tests.

Production:

PasswordHasher
↓
bcrypt

Testing:

PasswordHasher
↓
FakePasswordHasher

Benefits:

* Fast execution
* Deterministic results
* Reduced CPU consumption

---

## InMemoryStore

Purpose:

Provide reusable storage behavior for fake repositories.

Responsibilities:

* create entities
* update entities
* delete entities
* search entities

Benefits:

* Less duplicated fake repository logic
* Easier maintenance
* Consistent behavior

---

# Fixtures

## Purpose

Fixtures provide predefined datasets used across multiple tests.

Current example:

users.fixture.js

Instead of creating test users repeatedly, fixtures generate reusable collections of users.

Example:

const users = usersFixture(10);

Benefits:

* Consistent test scenarios
* Faster setup
* Reduced duplication

---

# Toolkit Entry Point

The toolkit exposes commonly used utilities through a centralized index.

Example:

module.exports = {
InMemoryRepository,
UserBuilder,
usersFixture,
};

Benefits:

* Simplified imports
* Cleaner test code
* Better discoverability

---

# Design Principles

The toolkit was designed around several principles.

---

## Reusability

Utilities should be reusable across multiple test types.

A builder used in unit tests should also be usable in integration tests.

---

## Readability

Tests should describe behavior, not setup complexity.

Good test:

it('authenticates a valid user')

The setup should support the test, not dominate it.

---

## Isolation

Tests should remain independent from external infrastructure whenever possible.

The toolkit makes this possible through fake implementations.

---

## Consistency

Developers should create test data using the same patterns across the codebase.

Builders, fixtures, and fakes help maintain consistency.

---

# Example Usage

Authentication test:

AuthService
↓
FakePasswordHasher
↓
InMemoryUserRepository
↓
UserBuilder

The service can be tested entirely in memory.

Benefits:

* Fast execution
* No PostgreSQL
* No bcrypt
* No external services

The test remains focused on business behavior.

---

# Benefits Observed

The testing toolkit provides several practical advantages:

* Faster test creation
* Reduced boilerplate
* More readable tests
* Easier maintenance
* Better separation between setup and behavior

As the project grows, these benefits become increasingly valuable.

---

# Future Improvements

Potential additions include:

* OrderBuilder
* ProductBuilder
* CustomerBuilder
* Authentication fixtures
* Database factory utilities
* Shared assertion helpers

The toolkit is intended to evolve alongside the application's testing needs.

---

# Summary

The testing toolkit is a collection of reusable utilities designed to simplify test creation and improve maintainability.

By providing builders, fakes, fixtures, and shared helpers, the toolkit allows tests to focus on business behavior rather than setup complexity.

This approach improves readability, consistency, and development velocity while supporting the project's layered testing strategy.
