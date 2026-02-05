const { Strategy } = require('passport-local');
const { httpErrorMapper } = require('../../http/error-mapper');

module.exports = function createLocalStrategy(authService) {
  return new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await authService.authenticate(email, password);
        done(null, user);
      } catch (error) {
        done(httpErrorMapper(error), false);
      }
    },
  );
};
