const passport = require('passport');

const AuthService = require('../application/auth/auth.service');

const configurePassport = require('../infrastructure/auth/passport/passport.factory');

const AuthRouter = require('../infrastructure/http/routes/auth/auth.router');

module.exports = function bootstrapAuth({ userRepository, passwordHasher, tokenService, mailer }) {
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

  const authenticate = passport.authenticate('local', {
    session: false,
  });

  const authRouter = new AuthRouter({
    authService,
    authenticate,
  });

  return {
    authService,
    authRouter,
    userRepository,
  };
};
