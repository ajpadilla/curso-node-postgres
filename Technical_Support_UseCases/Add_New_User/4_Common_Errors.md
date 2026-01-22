# Add New User - Common Errors

| Error Type                     | Cause                                              | Response |
|--------------------------------|---------------------------------------------------|----------|
| Validation Error               | Missing or invalid email/password                | 400      |
| Duplicate Email                 | Email already exists in DB                        | 409      |
| Database Connection Error       | DB unavailable or network issues                 | 500      |
| Unexpected Error                | Unhandled exceptions in service or repository   | 500      |
