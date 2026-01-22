# Add New User - Tests Reference

## Unit Tests
- `user.service.fake.unit.test.js` → verifies business logic for creating users
  - Confirms email uniqueness
  - Confirms password hashing

## Integration Tests
- `users.services.mock.integration.test.js` → tests user creation end-to-end with Sequelize
  - Confirms data is persisted in DB
  - Confirms proper HTTP responses

## E2E Tests
- `users.e2e.js` → simulates actual HTTP requests
  - Confirms route, validation, and database flow
