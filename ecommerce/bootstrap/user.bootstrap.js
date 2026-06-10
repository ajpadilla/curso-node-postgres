const UserService = require('../application/user/user.service');

const SequelizeUserRepository = require('../infrastructure/persistence/sequelize/sequelize-user.repository');

const UserRouter = require('../infrastructure/http/routes/user/users.router');

module.exports = function bootstrapUser({ passwordHasher }) {
  const userRepository = new SequelizeUserRepository();

  const userService = new UserService({
    userRepository,
    passwordHasher,
  });

  const userRouter = new UserRouter({
    userService,
  });

  return {
    userRepository,
    userService,
    userRouter,
  };
};
