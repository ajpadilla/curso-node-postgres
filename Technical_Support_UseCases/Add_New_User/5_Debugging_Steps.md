# Add New User - Debugging Steps

## 🎯 Goal

Identify why user creation fails and where the error occurs
(request, validation, service, database, or infrastructure).

---

## Step 1: Reproduce the Issue

Confirm the problem can be reproduced.

Example:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }'
  ```

---

## Step 2: Check Request Payload

Verify client request is valid.

- Confirm `email` and `password` exist
- Check JSON format
- Validate headers
- Ensure fields are not empty
- Reproduce with curl

---

## Step 3: Validate Input Layer

Confirm validation middleware works.

- Check `createUserSchema`
- Verify `validatorHandler` is applied
- Test invalid input
- Test valid input

---

## Step 4: Check Service Logic

Verify business logic is working correctly.

- Inspect `UserService.create()`
- Check duplicate email logic
- Confirm password hashing
- Review thrown errors

---

## Step 5: Check Repository / Database

Confirm persistence layer is working.

- Check `SequelizeUserRepository.create()`
- Verify DB connection
- Confirm unique constraints
- Inspect table structure
- Verify PostgreSQL container is running:
  ```bash
  docker ps

---

## Step 6: Check Error Mapping

Verify errors are translated correctly.

- Check `httpErrorMapper`
- Confirm 400 / 409 / 500 mapping
- Validate error messages

---

## Step 7: Run Automated Tests

Confirm behavior using tests.

- Run unit tests
- Run integration tests
- Review failures

---

## Step 8: Check Logs and Monitoring

Inspect system logs.

- Review Sequelize logs
- Check service logs
- Look for stack traces

---

## Step 9: Isolate and Fix

Identify root cause and apply fix.

- Locate failing layer
- Apply fix
- Update tests
- Re-test endpoint
- Document solution

---

