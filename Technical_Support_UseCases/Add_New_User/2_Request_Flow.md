# Add New User - Request Flow

1. **HTTP Request**
  - Method: `POST`
  - Endpoint: `/users`
  - Body:
    ```json
    {
      "email": "test@test.com",
      "password": "123"
    }
    ```

2. **Route Handling**
  - `users.router.js` receives the request
  - `validatorHandler(createUserSchema, 'body')` validates input

3. **Application Layer**
  - `UserService.create(body)` processes the creation
  - Checks for duplicate email
  - Calls `BcryptPasswordHasher.hash()` for password

4. **Persistence Layer**
  - `SequelizeUserRepository.create(data)` saves user in DB
  - Uses Sequelize `User.create(data)`

5. **Error Handling**
  - Errors thrown in service or repository go through `httpErrorMapper`
  - Mapped to proper HTTP response (400, 409, 500, etc.)

6. **Response**
  - Status 201 Created
  - Returns JSON:
    ```json
    {
      "id": "uuid",
      "email": "test@test.com"
    }
    ```
