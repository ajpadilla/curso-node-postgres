# Add New User - Debugging Steps

1. **Check request payload**
  - Ensure `email` and `password` exist and are valid
2. **Validate input**
  - `validatorHandler(createUserSchema, 'body')`
3. **Check service logic**
  - `UserService.create()` handles duplicate email
  - Ensure `BcryptPasswordHasher` is working
4. **Check repository**
  - `SequelizeUserRepository.create(data)` persists user
  - Confirm database connectivity
5. **Check error mapping**
  - Confirm `httpErrorMapper` returns correct HTTP code
6. **Reproduce using tests**
  - Run unit test: `user.service.fake.unit.test.js`
  - Run integration test: `users.services.mock.integration.test.js`
7. **Check logs**
  - Look for Sequelize or service errors in console
