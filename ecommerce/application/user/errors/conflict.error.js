// application/errors/conflict.error.js
const ApplicationError = require('./application.error');

class ConflictError extends ApplicationError {
  toHttp() {
    return {
      status: 409,
      message: this.message,
    };
  }
}

module.exports = ConflictError;
