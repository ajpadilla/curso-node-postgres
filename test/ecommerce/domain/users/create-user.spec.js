const {
  InMemoryRepository,
  UserBuilder,
} = require('../../../toolkit');

describe('Get user', () => {
  it('returns all user', async () => {
    const users = [
      UserBuilder.aUser().build(),
      UserBuilder.aUser().build(),
    ];

    const repo = new InMemoryRepository({
      collections: { users: users },
    });

    const result = await repo.getAll('users');

    expect(result).toHaveLength(2);
  });
});
