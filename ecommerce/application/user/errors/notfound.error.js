// application/errors/not-found.error.js
const ApplicationError = require('./application.error');

class NotFoundError extends ApplicationError {
  toHttp() {
    return {
      status: 404,
      message: this.message,
    };
  }
}

module.exports = NotFoundError;
