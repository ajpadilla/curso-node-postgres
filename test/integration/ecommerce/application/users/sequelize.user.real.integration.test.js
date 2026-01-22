const SequelizeUserRepository = require('../../../../../ecommerce/infrastructure/persistence/sequelize/sequelize-user.repository');
const UserService = require('../../../../../ecommerce/application/user/user.service');
const { sequelize } = require('../../../../../database/sequelize'); // adjust path

const { User } = require('../../../../../database/models/user.model');
const BcryptPasswordHasher = require("../../../../../ecommerce/infrastructure/security/bcrypt.password-hasher"); // your User model

beforeEach(async () => {
  // truncate the user table before each test
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close(); // close connection after all tests
});

it('creates user in database', async () => {
  const userRepository = new SequelizeUserRepository();
  const passwordHasher = new BcryptPasswordHasher();

  const userService = new UserService(userRepository, passwordHasher);

  const user = await userService.create({
    email: 'test@test.com',
    password: '123'
  });

  expect(user.id).toBeDefined();
});
