const WinstonLogger = require('../infrastructure/logger/WinstonLogger');
const createHttpLoggerHandler = require('../infrastructure/http/middlewares/observability/httpLogger.middleware');
const createRequestIdMiddleware = require('../infrastructure/http/middlewares/observability/requestId.middleware');
const UuidRequestIdGenerator = require('../../shared/infrastructure/request-id/uuid-request-id.generator');

module.exports = function bootstrapObservability() {
  const logger = new WinstonLogger();

  const requestIdGenerator = new UuidRequestIdGenerator();

  const requestId = createRequestIdMiddleware({
    requestIdGenerator,
  });

  const httpLogger = createHttpLoggerHandler(logger);

  return {
    logger,
    middlewares: {
      requestId: requestId.requestId,
      httpLogger: httpLogger.httpLogger,
    },
  };
};
