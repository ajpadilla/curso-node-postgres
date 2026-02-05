const Logger = require('../../../shared/logger/Logger');
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

  info(msg, meta) {
    this.logger.info(msg, meta);
  }

  warn(msg, meta) {
    this.logger.warn(msg, meta);
  }

  error(msg, meta) {
    this.logger.error(msg, meta);
  }

  debug(msg, meta) {
    this.logger.debug(msg, meta);
  }
}

module.exports = WinstonLogger;
