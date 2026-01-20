const createLocalStrategy = require('./local.strategy');
const createJwtStrategy = require('./jwt.strategy');

module.exports = function configurePassport(passport, { authService, jwtSecret }) {
  passport.use('local', createLocalStrategy(authService));
  passport.use('jwt', createJwtStrategy({ secret: jwtSecret }));
};
