const express = require('express');

const createUserRouter = require('../domain/user/users.router');
const UserService = require('../application/user/user.service');
const SequelizeUserRepository = require('../infrastructure/persistence/sequelize/sequelize-user.repository');
const BcryptPasswordHasher = require("../infrastructure/security/bcrypt.password-hasher");

const userRepository = new SequelizeUserRepository();
const bcryptPasswordHasher = new BcryptPasswordHasher();
const userService = new UserService(userRepository, bcryptPasswordHasher);

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/user', createUserRouter(userService));
}

module.exports = routerApi;
