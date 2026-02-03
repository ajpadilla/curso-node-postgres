class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }

  /**
   * HTTP mapping metadata
   * Controller will use this blindly
   */
  toHttp() {
    return {
      status: 500,
      message: this.message,
    };
  }
}

module.exports = ApplicationError;
