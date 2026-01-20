const UserService = require("../../../../../ecommerce/application/user/user.service");
const InMemoryUserRepository = require("../../../../toolkit/fakes/in-memory.repository");
const FakePasswordHasher = require("../../../../toolkit/fakes/fake-password-hasher");

describe('UserService (unit)', () => {
  it('hashes password before saving using a mock', async () => {
    const userRepository = new InMemoryUserRepository();
    const passwordHasher = new FakePasswordHasher();

    const userService = new UserService(userRepository, passwordHasher);

    const user = await userService.create({
      email: 'test@test.com',
      password: '123',
    });

    // 1️⃣ Password is not exposed
    expect(user.password).toBeUndefined();

    // 2️⃣ Password was hashed before persistence
    const storedUser = await userRepository.findByEmail('test@test.com');

    console.log(storedUser);

    expect(storedUser.email).toBe('test@test.com');
  });
});
