# Add New User - Overview

## Purpose
This use case allows creating a new user with an email and password.
The password is securely hashed before storing in the database.

## Scope
- User registration through the API
- Validation of input data
- Error handling for common problems (duplicate email, invalid data)

---

## Related Architecture
See: ../_Shared/Architecture.md

---

## High-Level Flow

```txt
Client → Router → Middleware → Service → Repository → Response
