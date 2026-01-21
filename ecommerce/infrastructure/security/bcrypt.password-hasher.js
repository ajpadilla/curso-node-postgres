const bcrypt = require('bcrypt');
const PasswordHasher = require('../../../shared/infrastructure/security/password.hasher');

class BcryptPasswordHasher extends PasswordHasher {
  async hash(plain) {
    return bcrypt.hash(plain, 10);
  }
  async compare(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = BcryptPasswordHasher;
