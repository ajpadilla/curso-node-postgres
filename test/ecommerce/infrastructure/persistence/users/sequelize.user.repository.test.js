const SequelizeUserRepositoryTest = require('../../../../ecommerce/infrastructure/persistence/sequelize/sequelize-user.repository');
const UserService = require('../../../../ecommerce/application/user/user.service');
const { sequelize } = require('../../../../database/sequelize'); // adjust path

const { User } = require('../../../../database/models/user.model'); // your User model

beforeEach(async () => {
  // truncate the user table before each test
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close(); // close connection after all tests
});

it('creates user in database', async () => {
  const repo = new SequelizeUserRepositoryTest();
  const service = new UserService(repo);

  const user = await service.create({
    email: 'test@test.com',
    password: '123'
  });

  expect(user.id).toBeDefined();
});
