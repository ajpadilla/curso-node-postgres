const UserService = require('../../../../../ecommerce/application/user/user.service');

describe('UserService.create (unit)', () => {
  it('hashes password before saving', async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),

      create: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed-password',
      }),
    };

    const passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
    };

    const service = new UserService({
      userRepository,
      passwordHasher,
    });

    const result = await service.create({
      email: 'test@test.com',
      password: '123',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@test.com');

    expect(passwordHasher.hash).toHaveBeenCalledWith('123');

    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'hashed-password',
    });

    // 🔐 important rule
    expect(result.password).toBeUndefined();
  });
});
