const UserService = require('../../../../../ecommerce/application/user/user.service');
//const { InMemoryRepository, usersFixture } = require('../../../../toolkit');
describe('UserService', () => {
  it('hashes password before saving using a mock', async () => {
    const fakeRepo = {
      create: jest.fn().mockResolvedValue({
        dataValues: { id: 1, email: 'a@a.com' },
      }),
    };

    const fakeHasher = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
    };

    const service = new UserService(fakeRepo, fakeHasher);

    const user = await service.create({
      email: 'a@a.com',
      password: 'plain',
    });

    expect(fakeRepo.create).toHaveBeenCalled();
    expect(user.password).toBeUndefined(); // still works
    expect(fakeHasher.hash).toHaveBeenCalledWith('plain'); // optional: check it hashed
  });
});

/*it('creates a user', async () => {
  const users = usersFixture(3);
  const repo = new InMemoryRepository({ users });
  const service = new UserService(repo);

  const user = await service.create({
    email: 'new@test.com',
    password: '123',
  });

  expect(user.id).toBeDefined();
});

it('returns all user', async () => {
  const users = usersFixture(3);
  const repo = new InMemoryRepository({ users });
  const service = new UserService(repo);

  const result = await service.findAll();

  expect(result).toHaveLength(3);
});*/
