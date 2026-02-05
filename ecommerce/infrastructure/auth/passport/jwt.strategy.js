const { Strategy, ExtractJwt } = require('passport-jwt');

module.exports = function createJwtStrategy({ secret }) {
  return new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async (payload, done) => {
      return done(null, payload);
    },
  );
};
