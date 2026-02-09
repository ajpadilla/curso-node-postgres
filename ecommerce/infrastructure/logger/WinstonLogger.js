const Logger = require('../../../shared/infrastructure/logger');
const { createLogger, format, transports } = require('winston');

class WinstonLogger extends Logger {
  constructor() {
    super();
    this.logger = createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }), // Include stack traces
        format.splat(),
        format.json(), // JSON for production
      ),
      defaultMeta: { service: 'my-express-app' },
      transports: [
        new transports.Console({
          format:
            process.env.NODE_ENV === 'production'
              ? format.json()
              : format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
}

module.exports = WinstonLogger;
