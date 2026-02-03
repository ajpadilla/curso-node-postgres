# 🚀 E-commerce Platform (In Progress)

A modular, testable e-commerce backend built with Node.js, PostgreSQL, and Clean Architecture principles.

This project focuses on building reliable, maintainable backend services with strong separation of concerns, automated testing, and scalable infrastructure.

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

## 🏗️ Architecture

The project follows a layered architecture inspired by Clean Architecture and DDD principles.

ecommerce/
├── application → Use cases and business logic
├── domain → Core entities and interfaces
├── infrastructure → Database, security, HTTP, external services
├── bootstrap → Dependency injection


### Key Principles

- Dependency Inversion
- Separation of Concerns
- Infrastructure Independence
- Testability by Design

---

## 📂 Project Structure

database/ → Sequelize models, migrations, PostgreSQL config
ecommerce/ → Core business logic
shared/ → Cross-cutting abstractions
test/ → Unit, integration, and E2E tests
Technical_Support/ → Debugging and support playbooks
docker-compose.yml → Local development environment


### Testing Toolkit
```
test/toolkit/
├── fakes → Fake implementations
├── builders → Test data builders
├── fixtures → Static test data
```

Used to isolate domain logic and enable fast automated tests.

---

## 📊 Case Study: User Registration

### Initial Challenges

The first implementation of user creation:

- Directly depended on Sequelize and bcrypt
- Exposed ORM internals (`dataValues`)
- Mixed infrastructure and business logic
- Was difficult to test in isolation

This increased technical risk and slowed development.

---

### Solution

The user registration flow was refactored to:

- Introduce repository and service abstractions
- Isolate security concerns (password hashing, JWT)
- Apply Dependency Inversion Principle
- Use in-memory fakes for testing
- Add unit and integration test coverage

Key components:

- `UserRepository`
- `PasswordHasher`
- `JwtTokenService`
- Fake and in-memory implementations

---

### Result

- Domain logic independent of infrastructure
- Reliable automated test suite
- Safer refactoring and deployments
- Easier extension for authentication and roles
- Reduced debugging time

---

## 📈 Business Impact

User registration is the primary entry point to platform revenue.

This refactor improved:

- Signup reliability and user retention
- Security of credential handling
- Development velocity
- Long-term maintenance cost
- System stability for scaling

By reducing technical risk, the platform can evolve faster and more safely.

---

## 🧪 Testing Strategy

The project includes multiple test layers:

### Unit Tests
- Validate domain and application logic
- Use fakes and in-memory repositories

### Integration Tests
- Validate database and infrastructure
- Run against Sequelize/PostgreSQL

### E2E Tests
- Simulate real HTTP workflows

Example:

```bash
npm test
🐳 Development Environment (Docker)
PostgreSQL is provided via Docker:

services:
  postgres_node_platzi:
    image: postgres:13
    environment:
      POSTGRES_DB: my_store
      POSTGRES_USER: nico
      POSTGRES_PASSWORD: admin123
    ports:
      - "5532:5432"
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
Start services:

docker-compose up -d 
```

⚙️ Setup
1. Install Dependencies
npm install
2. Configure Environment
cp config/config.json.example config/config.json
Edit environment variables as needed.

3. Run Migrations
npm run migrations
4. Start Server
npm run dev
📚 Technical Support Playbooks
The Technical_Support_UseCases directory contains structured documentation for:

Expected behavior

Debugging steps

Common errors

Test references

Solution flows

These documents are used for internal troubleshooting and knowledge sharing.

🚧 Current Status
✅ User registration and authentication

✅ Modular security layer (bcrypt, JWT)

✅ Repository abstraction

✅ Automated test toolkit

🚧 Orders and payments (planned)

🚧 Inventory management (planned)

🛠️ Tech Stack

- Node.js

- Express

- PostgreSQL

- Sequelize

- JWT

- Bcrypt

- Jest

- Docker

👨‍💻 Author
Alvaro Padilla

Backend Developer focused on building reliable, testable, and scalable systems.
