const passport = require('passport');

const AuthService = require('../application/auth/auth.service');

const SequelizeUserRepository = require('../infrastructure/persistence/sequelize/sequelize-user.repository');

const configurePassport = require('../infrastructure/auth/passport/passport.factory');

const AuthRouter = require('../infrastructure/http/routes/auth/auth.router');

module.exports =
  function bootstrapAuth({
                           passwordHasher,
                           tokenService,
                           mailer,
                         })
  {

    const userRepository =
      new SequelizeUserRepository();

    const authService =
      new AuthService({
        userRepository,
        passwordHasher,
        tokenService,
        mailer,
      });

    configurePassport(
      passport,
      {
        authService,
        jwtSecret:
        process.env.JWT_SECRET,
      }
    );

    const authenticate =
      passport.authenticate(
        'local',
        {
          session: false,
        }
      );

    const authRouter =
      new AuthRouter({
        authService,
        authenticate,
      });

    return {
      authService,
      authRouter,
      userRepository,
    };
  };
