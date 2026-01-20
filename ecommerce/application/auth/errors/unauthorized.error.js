// src/application/auth/errors/UnauthorizedError.js
class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
