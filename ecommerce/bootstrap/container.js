const express = require('express');

const createUserRouter = require('../infrastructure/http/routes/user/users.router');
const UserService = require('../application/user/user.service');
const SequelizeUserRepository = require('../infrastructure/persistence/sequelize/sequelize-user.repository');
const BcryptPasswordHasher = require("../infrastructure/security/bcrypt.password-hasher");
const AuthService = require("../application/auth/auth.service");
const passport = require("passport");
const JwtTokenService = require("../infrastructure/security/jwt.token.service");
const NodemailerMailer = require("../infrastructure/mail/node.mailer.mailer");
const configurePassport = require("..//infrastructure/auth/passport/passport.factory");

const userRepository = new SequelizeUserRepository();
const bcryptPasswordHasher = new BcryptPasswordHasher();
const userService = new UserService(userRepository, bcryptPasswordHasher);


const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService(process.env.JWT_SECRET);
const mailer = new NodemailerMailer({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const authService = new AuthService({
  userRepository,
  passwordHasher,
  tokenService,
  mailer,
});

configurePassport(passport, {
  authService,
  jwtSecret: process.env.JWT_SECRET,
});

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/user', createUserRouter(userService));
}

module.exports = routerApi;
