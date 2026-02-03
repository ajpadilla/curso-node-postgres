#  Add New User - Common Errors

---

## ❌ 400 - Validation Error

Layer: Middleware / Application

Cause:

- Missing `email` field
- Invalid request payload
- Validation schema rejection

Example:

```js
throw new ValidationError('Email is required');
``` 

Response:

- Status: 400 Bad Request

- Message: "Email is required"

Resolution:

- Check request body

- Verify validation schema

- Ensure required fields are present

---

## 409 - Conflict

Layer: Application / Database

Cause:
- Duplicate email already exists
- Unique constraint violation

Example:
- Database unique index on email

Response:

- Status: 409 Conflict

- Message: "Email already exists"

Resolution:

- Verify email uniqueness

- Check existing records in DB

- Clean test database if needed



--

## ❌ 500 - Internal Server Error

Layer: Application / Infrastructure

Cause:

- Password hasher not configured

- Password hashing failure

- Database connection failure

- Unexpected runtime error

Examples:

- throw new ApplicationError('Password hasher not configured');

- await this.passwordHasher.hash(data.password);


Response:

- Status: 500 Internal Server Error

- Message: "Internal server error"

Resolution:

- Verify service configuration

- Check dependency injection

- Check logs and stack traces

- Verify database connectivity
