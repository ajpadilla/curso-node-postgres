class PasswordHasher {
  async hash(plain) {
    throw new Error('Not implemented');
  }

  async compare(plain, hashed) {
    throw new Error('Not implemented');
  }
}

module.exports = PasswordHasher;
