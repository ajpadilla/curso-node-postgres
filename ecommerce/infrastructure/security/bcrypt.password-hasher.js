const bcrypt = require('bcrypt');
const PasswordHasher = require('../../domains/users/security/password.hasher');

class BcryptPasswordHasher extends PasswordHasher {
  async hash(plain) {
    return bcrypt.hash(plain, 10);
  }
}

module.exports = BcryptPasswordHasher;
