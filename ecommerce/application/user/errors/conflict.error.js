// application/errors/conflict.error.js
const ApplicationError = require('../../errors/application.error');

class ConflictError extends ApplicationError {
  constructor(message) {
    super(message, 409);
  }
}

module.exports = ConflictError;
