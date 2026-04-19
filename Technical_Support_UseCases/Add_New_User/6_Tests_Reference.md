# Add New User - Tests Reference

---

## 🧪 Unit Tests

Tests for individual components (services, validators, repositories).

Folder: `unit/ecommerce/...`

Files:

- `unit/ecommerce/application/user/user.service.create.fake.integration.test.js` → tests UserService logic in isolation
  - Confirms email uniqueness
  - Confirms password hashing
  - Uses `toolkit/fakes/fake-password-hasher.js`
- `unit/ecommerce/infrastructure/persistence/users/in-memory-repository.fake.unit.js` → tests repository logic with in-memory store
- `unit/ecommerce/application/auth/auth.service.fake.unit.test.js` → tests AuthService logic
- `unit/ecommerce/application/auth/auth.service.mock.unit.test.js` → tests AuthService with mocks

How to run:

```bash
npm test unit/ecommerce/application/user/user.service.create.fake.integration.test.js
``` 

Notes:

Uses fakes/mocks from toolkit/fakes/ for isolation

Builders/fixtures from toolkit/builders/ and toolkit/fixtures/ help create consistent test data

---

## 🧪 Integration Tests

Tests for full workflow: service + database + repository.

Folder: `integration/ecommerce/...`

Files:

- `integration/ecommerce/application/users/users.services.mock.integration.test.js` → mocks external services, tests DB persistence
- `integration/ecommerce/application/users/user.services.fake.integration.test.js` → end-to-end workflow with fakes
- `integration/ecommerce/application/users/sequelize.user.create.real.integration.test.js` → real Sequelize DB test

How to run:

```bash
npm test integration/ecommerce/application/users/users.services.mock.integration.test.js
``` 

Requirements:

- Test database running (Postgres)

- Environment variables loaded

- DB cleaned before tests

- Fixtures: toolkit/fixtures/users.fixture.js can be used for seeding

- Fakes: toolkit/fakes/in-memory.store.js or toolkit/fakes/fake-password-hasher.js as needed


## 🧪 E2E / Manual Tests

Full end-to-end tests simulating real HTTP requests.

Files / Tools:

`users.e2e.js` → simulates actual HTTP requests

Postman collection: <link here>

curl requests

How to run:

```bash
npm test integration/ecommerce/application/users/users.services.mock.integration.test.js
``` 

Scenarios:

- Create user with valid data → 201, persisted in DB

- Missing email/password → 400

- Invalid email format → 400

- Duplicate email → 409

- Unauthorized request → 401


## 🔧 Infrastructure / Docker Requirements

The following services must be running before integration and E2E tests.

PostgreSQL:

- Service: `postgres_node_platzi`
- Image: `postgres:13`
- Port: `5532 → 5432`
- Database: `my_store`
- User: `nico`

Start services:

```bash
docker-compose up -d postgres_node_platzi
Verify:

docker ps
psql -h localhost -p 5532 -U nico my_store
``` 
