# 🏗️ Architecture Overview

This document describes the high-level architecture of the system and the main design principles used to structure the codebase.

---

## 🎯 Purpose

The goal of this architecture is to:

* Separate business logic from technical concerns
* Improve testability and maintainability
* Allow independent evolution of components
* Simulate real-world backend system design

---

## 🧩 Architectural Style

The project follows a layered architecture inspired by:

* Clean Architecture
* Domain-Driven Design (DDD)

---

## 📂 High-Level Structure

```text
ecommerce/
 ├── domain
 ├── application
 ├── infrastructure
 └── bootstrap
```

---

## 🧠 Layer Responsibilities

### 1. Domain Layer

Contains the core business logic.

**Responsibilities:**

* Business rules
* Domain entities (conceptual)
* Repository contracts (interfaces)

**Key idea:**

> The domain does not depend on any framework or external system.

---

### 2. Application Layer

Implements use cases.

**Responsibilities:**

* Orchestrate business operations
* Coordinate domain objects and repositories
* Handle application-specific errors

**Example:**

* Creating a user
* Authenticating a user

---

### 3. Infrastructure Layer

Implements technical details.

**Responsibilities:**

* Database access (Sequelize)
* HTTP layer (Express routers)
* Authentication (Passport, JWT)
* External services (Email, Logging, Metrics)

**Key idea:**

> Infrastructure depends on application/domain, never the other way around.

---

### 4. Bootstrap Layer

Wires everything together.

**Responsibilities:**

* Dependency injection
* Service initialization
* Router composition

**Example:**

* Creating `UserService` with repository + password hasher
* Configuring Passport strategies

---

## 🔄 Request Lifecycle (Simplified)

```text
Client
  ↓
Express App (middlewares)
  ↓
Router (validation)
  ↓
Application Service (use case)
  ↓
Repository (infrastructure)
  ↓
Database
```

Errors flow back through a centralized error-handling pipeline.

---

## 🧱 Key Design Principles

### 1. Separation of Concerns

Each layer has a single responsibility and clear boundaries.

---

### 2. Dependency Inversion

* High-level modules (domain/application) do not depend on low-level modules
* Infrastructure implements contracts defined by the domain

---

### 3. Explicit Dependencies

Dependencies are manually injected in a central container.

This avoids hidden coupling and improves testability.

---

### 4. Framework Isolation

Business logic is not coupled to Express, Sequelize, or any external library.

---

## 📊 Cross-Cutting Concerns

Handled via middleware and shared modules:

* Logging (Winston)
* Metrics (Prometheus)
* Request tracing (Request ID)
* Error handling (centralized pipeline)

---

## 🧠 Summary

This architecture prioritizes:

* Maintainability over simplicity
* Explicit design over hidden abstractions
* Testability over convenience

It reflects patterns commonly used in production backend systems.
