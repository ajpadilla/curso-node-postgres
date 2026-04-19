// application/errors/not-found.error.js
const ApplicationError = require('../../errors/application.error');

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message, 404);
  }
}

module.exports = NotFoundError;
