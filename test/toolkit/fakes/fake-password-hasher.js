const PasswordHasher = require("../../../shared/infrastructure/security/password.hasher");

class FakePasswordHasher extends PasswordHasher {
  async hash(plain) {
    return `hashed(${plain})`;
  }

  async compare(plain, hashed) {
    return plain === hashed;
  }
}

module.exports = FakePasswordHasher
