// application/errors/validation.error.js
const ApplicationError = require('./application.error');

class ValidationError extends ApplicationError {
  toHttp() {
    return {
      status: 400,
      message: this.message,
    };
  }
}

module.exports = ValidationError;
