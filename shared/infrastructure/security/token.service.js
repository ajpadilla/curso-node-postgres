const TokenService = require("../../../infrastructure/security/jwt.token.service");

class JwtTokenService extends TokenService {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = JwtTokenService;
