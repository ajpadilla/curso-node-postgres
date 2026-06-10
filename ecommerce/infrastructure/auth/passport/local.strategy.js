const { Strategy } = require('passport-local');

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
        done(error, false);
      }
    },
  );
};
