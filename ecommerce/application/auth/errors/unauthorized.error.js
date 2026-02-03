// src/application/auth/errors/UnauthorizedError.js
const ApplicationError = require("../../errors/application.error");

class UnauthorizedError extends ApplicationError {
  toHttp() {
    return {
      status: 401,
      message: this.message,
    };
  }
}

module.exports = UnauthorizedError;
