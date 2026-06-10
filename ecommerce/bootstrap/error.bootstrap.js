const WinstonLogger = require('../infrastructure/logger/WinstonLogger');

const createErrorHandlers = require('../infrastructure/http/middlewares/error.middleware');

const createErrorMapperMiddleware = require('../infrastructure/http/middlewares/error-mapper.middleware');

const { httpErrorMapper } = require('../infrastructure/http/error-mapper');

module.exports = function bootstrapErrors() {
  const logger = new WinstonLogger();

  const errorHandlers = createErrorHandlers(logger);

  const errorMapperMiddleware = createErrorMapperMiddleware({
    httpErrorMapper,
  });

  return {
    logErrors: errorHandlers.logErrors,

    ormErrorHandler: errorHandlers.ormErrorHandler,

    boomErrorHandler: errorHandlers.boomErrorHandler,

    genericErrorHandler: errorHandlers.genericErrorHandler,

    notFoundHandler: errorHandlers.notFoundHandler,

    errorMapperMiddleware,
  };
};
