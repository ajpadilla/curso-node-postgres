# Add New User - Overview

## Purpose
This use case allows creating a new user with an email and password.
The password is securely hashed before storing in the database.

## Scope
- User registration through the API
- Validation of input data
- Error handling for common problems (duplicate email, invalid data)

## Key Files
- `users.router.js` → HTTP routes for user creation
- `user.service.js` → Handles business logic
- `sequelize-user.repository.js` → Persists user in database
- `bcrypt.password-hasher.js` → Hashes passwords
- `error-mapper.js` → Maps internal errors to HTTP responses
