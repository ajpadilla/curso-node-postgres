class PasswordHasher {
  async hash(_plain) {
    throw new Error('Not implemented');
  }

  async compare(_plain, _hashed) {
    throw new Error('Not implemented');
  }
}

module.exports = PasswordHasher;
