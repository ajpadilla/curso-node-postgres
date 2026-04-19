# 🚀 E-commerce Platform (In Progress)

A modular, testable e-commerce backend built with Node.js, PostgreSQL, and Clean Architecture principles.

This project is a backend training system designed to simulate real-world architectural decisions in modern web applications.

Instead of focusing only on CRUD operations, this project explores:

* Clean Architecture principles
* Domain-driven design boundaries
* Authentication strategies
* Observability (metrics, logging, tracing)
* Testing at multiple levels
* Performance validation

---

## 📌 Overview

This platform implements core e-commerce functionality including:

- User registration and authentication
- Secure password hashing and JWT-based sessions
- Modular repository and service layers
- Centralized error handling
- Automated unit, integration, and E2E testing

The system is designed to support future extensions such as orders, payments, and inventory management.

---

## 🚀 Tech Stack

* Node.js (Express)
* PostgreSQL + Sequelize
* Docker & Docker Compose
* Jest (unit, integration, e2e)
* Playwright (UI testing)
* Autocannon (performance testing)
* Prometheus metrics


## 🧠 Architecture Overview

The project follows a layered architecture inspired by **Clean Architecture + DDD**:

```
ecommerce/
 ├── domain           → Business rules (pure logic)
 ├── application      → Use cases (orchestration)
 ├── infrastructure   → Frameworks, DB, HTTP, external services
 └── bootstrap        → Dependency injection
```

### Key Principles

* **Domain is isolated** from frameworks
* **Application layer orchestrates use cases**
* **Infrastructure implements technical details**
* **Dependency inversion via container**

---


## 🔐 Authentication

Supports multiple strategies:

* JWT authentication
* Local strategy (email/password)
* Session-based middleware

Implemented using a modular Passport setup.

---

## 📊 Observability

The system includes:

* Request ID tracking
* Structured logging (Winston)
* Prometheus metrics endpoint
* HTTP request logging middleware

---

## 🧪 Testing Strategy

The project includes multiple testing layers:

| Type            | Purpose                   |
| --------------- | ------------------------- |
| Unit            | Isolated logic validation |
| Integration     | Component interaction     |
| E2E             | Full system validation    |
| UI (Playwright) | Frontend behavior         |

---

## ⚡ Performance Testing

Performance tests are executed using Autocannon:

```
dynamicpayloadgenerator/autocannon-script.js
```

Used to simulate load and analyze:

* Latency
* Throughput
* System bottlenecks

---

## 🐳 Running the Project

## 🐳 Running the Project

## 🧩 Available Scripts

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm run dev`         | Start server in development mode |
| `npm start`           | Start server in production mode  |
| `npm test`            | Run unit tests                   |
| `npm run test:api`    | Run API end-to-end tests         |
| `npm run test:ui`     | Run UI tests with Playwright     |
| `npm run db:migrate`  | Run database migrations          |
| `npm run db:seed:run` | Seed database                    |
| `npm run db:rebuild`  | Reset and recreate database      |


### 📋 Requirements

Make sure you have installed:

* Node.js (>= 18)
* Docker & Docker Compose
* npm

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd my-store
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This will start a PostgreSQL instance with:

* Database: `my_store`
* User: `nico`
* Password: `admin123`
* Port: `5532`

---

### 4. Configure environment variables

Create a `.env` file in the root:

```bash
DB_HOST=localhost
DB_PORT=5532
DB_NAME=my_store
DB_USER=nico
DB_PASSWORD=admin123

JWT_SECRET=your_secret_key
```

---

### 5. Run database migrations

```bash
npm run db:migrate
```

(Optional) Seed data:

```bash
npm run db:seed:run
```

---

### 6. Start the application

```bash
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

## 🧪 Running Tests

### Unit tests

```bash
npm test
```

### API (E2E) tests

```bash
npm run test:api
```

### UI tests (Playwright)

```bash
npm run test:ui
```

---

## ⚡ Performance Testing

Run load testing using Autocannon:

```bash
node dynamicpayloadgenerator/autocannon-script.js
```

---

## 🧹 Code Quality

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

---

## 📂 Project Structure Highlights

* `ecommerce/` → Core business architecture
* `shared/` → Cross-cutting concerns
* `database/` → Sequelize setup and models
* `test/` → Full testing pyramid
* `Technical_Support_UseCases/` → Debugging & knowledge base
* `dynamicpayloadgenerator/` → Performance testing scripts

---

## 🎯 Learning Goals

This project was built to practice:

* Designing scalable backend systems
* Separating business logic from infrastructure
* Handling authentication in a modular way
* Building production-like observability
* Writing maintainable and testable code

---

## 🧠 Key Takeaways

* Architecture decisions impact maintainability more than frameworks
* Testing strategy is part of system design
* Observability is not optional in real systems
* Performance must be measured, not assumed

---

## 📌 Future Improvements

* Event-driven architecture (Kafka / RabbitMQ)
* CQRS implementation
* Caching layer (Redis)
* Horizontal scaling (cluster / workers)
* CI/CD pipeline

---

## 👨‍💻 Author

Alvaro Padilla

Backend Developer focused on:

* Distributed systems
* System design
* High-performance Node.js applications

---
