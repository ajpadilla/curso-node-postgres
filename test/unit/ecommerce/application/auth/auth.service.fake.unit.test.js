const InMemoryUserRepository = require('../../../../toolkit/fakes/in-memory.repository');
const FakePasswordHasher = require('../../../../toolkit/fakes/fake-password-hasher');
const AuthService = require('../../../../../ecommerce/application/auth/auth.service');

it('authenticates a user using in-memory repository', async () => {
  const passwordHasher = new FakePasswordHasher();

  const password = await passwordHasher.hash('123');

  const userRepository = new InMemoryUserRepository({
    users: [
      {
        id: 1,
        email: 'test@test.com',
        password: password,
        role: 'user',
      },
    ],
  });

  const service = new AuthService({
    userRepository,
    passwordHasher,
    tokenService: {},
    mailer: {},
  });

  const user = await service.authenticate('test@test.com', password);

  expect(user.email).toBe('test@test.com');
});
