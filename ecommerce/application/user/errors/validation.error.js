// application/errors/validation.error.js
const ApplicationError = require('../../errors/application.error');

class ValidationError extends ApplicationError {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = ValidationError;
