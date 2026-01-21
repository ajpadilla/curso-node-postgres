const  AuthService =  require("../../../../../ecommerce/application/auth/auth.service");

it('authenticates a user with valid credentials', async () => {
  const userRepository = {
    findByEmail: jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashed',
      role: 'user',
    }),
  };

  const passwordHasher = {
    compare: jest.fn().mockResolvedValue(true),
  };

  const service = new AuthService({
    userRepository,
    passwordHasher,
    tokenService: {},
    mailer: {},
  });

  const user = await service.authenticate('test@test.com', '123');

  expect(user.email).toBe('test@test.com');
});
