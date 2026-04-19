class ApplicationError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }

  toHttp() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}
module.exports = ApplicationError;
