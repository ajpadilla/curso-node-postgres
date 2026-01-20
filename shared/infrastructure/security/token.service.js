const TokenService = require("../../../ecommerce/infrastructure/security/jwt.token.service");


class TokenService {
  sign(payload) {
    throw new Error('Not implemented');
  }

  verify(token) {
    throw new Error('Not implemented');
  }
}

module.exports = TokenService;
