# Fakes vs Mocks

## Overview

This project uses both fakes and mocks depending on the testing goal.

Although both techniques replace real dependencies, they solve different problems and provide different levels of confidence.

Understanding when to use each approach helps create tests that are both reliable and maintainable.

---

# Why Replace Dependencies?

Business logic should be tested independently from external systems.

Examples of external dependencies:

* PostgreSQL
* bcrypt
* JWT services
* email providers
* HTTP APIs

Using real infrastructure in every test would make tests:

* slower
* harder to set up
* less deterministic
* more difficult to debug

For this reason, tests often replace dependencies with test doubles.

The project primarily uses:

* Fakes
* Mocks

---

# What Is a Fake?

A fake is a working implementation of a dependency.

Unlike a mock, a fake contains real behavior and state.

The goal is to simulate a dependency without requiring external infrastructure.

Examples from this project:

* InMemoryUserRepository
* FakePasswordHasher

---

# Example: InMemoryUserRepository

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
JavaScript Memory

The fake repository stores data in memory and behaves similarly to the real repository.

Benefits:

* Fast execution
* No database required
* More realistic than a mock
* Supports complex test scenarios

---

# Example: FakePasswordHasher

Production:

PasswordHasher
↓
bcrypt

Testing:

PasswordHasher
↓
FakePasswordHasher

Instead of executing CPU-intensive bcrypt operations, the fake returns predictable values.

Example:

hash("123")
↓
"hashed(123)"

Benefits:

* Faster tests
* Deterministic behavior
* No cryptographic cost

---

# Advantages of Fakes

Fakes provide several benefits:

* Realistic behavior
* Reduced setup complexity
* Easier refactoring
* Better confidence than simple mocks

Because fakes contain actual behavior, tests focus on business outcomes rather than implementation details.

This generally makes tests more resilient to code changes.

---

# Tradeoffs of Fakes

Fakes are not perfect.

Potential drawbacks:

* Additional code maintenance
* Fake behavior may diverge from production behavior
* Cannot fully reproduce infrastructure-specific bugs

For example:

An InMemoryUserRepository cannot detect:

* SQL errors
* Database constraints
* Sequelize configuration issues

Those concerns belong to integration tests.

---

# What Is a Mock?

A mock is an object used to verify interactions.

Instead of reproducing behavior, a mock focuses on expectations.

Typical questions answered by mocks:

* Was a method called?
* How many times was it called?
* Which arguments were passed?

Mocks verify collaboration between components.

---

# Example

Suppose AuthService depends on a token service.

Instead of generating a real token, a mock can verify:

* sign() was called
* correct user data was passed

Example:

AuthService
↓
MockTokenService

Test expectation:

sign({
sub: user.id,
role: user.role
})

The objective is not token generation.

The objective is verifying collaboration.

---

# Advantages of Mocks

Mocks are useful when:

* behavior is already tested elsewhere
* only interactions matter
* dependencies are expensive or complex

Benefits:

* Extremely fast
* Precise verification
* Good for interaction testing

---

# Tradeoffs of Mocks

Mocks can create fragile tests.

Problem:

Tests become coupled to implementation details.

Example:

If a method is renamed or internal behavior changes, tests may fail even though the business behavior remains correct.

This can lead to excessive maintenance.

For this reason, the project prefers fakes whenever realistic behavior is useful.

---

# Choosing Between Fakes and Mocks

General guideline used in this project:

Use a Fake when:

* behavior matters
* state matters
* realistic execution improves confidence

Examples:

* repositories
* password hashers
* in-memory storage

Use a Mock when:

* interactions matter
* behavior is irrelevant
* verifying collaboration is the primary goal

Examples:

* email services
* token services
* external APIs

---

# Testing Philosophy

This project favors behavior-oriented testing.

Whenever possible, tests verify:

"What happened?"

instead of:

"Which methods were called?"

Because of this, fake implementations are often preferred over mocks.

Example:

Preferred:

Can a user authenticate successfully?

Less valuable:

Was compare() called exactly once?

The first verifies business behavior.

The second verifies implementation details.

---

# Practical Examples From This Project

## Fake-Based Authentication Test

AuthService
↓
FakePasswordHasher
↓
InMemoryUserRepository

Goal:

Verify authentication behavior.

Questions:

* Can the user authenticate?
* Is the correct user returned?
* Are business rules respected?

---

## Mock-Based Authentication Test

AuthService
↓
MockTokenService

Goal:

Verify collaboration.

Questions:

* Was sign() called?
* Were correct claims provided?
* Was token generation requested?

---

# Summary

Both fakes and mocks are useful tools.

The choice depends on the testing objective.

Use fakes when realistic behavior improves confidence.

Use mocks when interaction verification is the primary concern.

In this project:

* Fakes are preferred for business logic tests.
* Mocks are used when collaboration between components must be verified.

This balance helps maintain fast tests while still validating meaningful system behavior.
