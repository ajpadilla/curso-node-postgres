const { ValidationError } = require('sequelize');

/**
 * Creates all error middlewares with injected logger
 */
function createErrorHandlers(logger) {
  // 1️⃣ Logs every error first
  function logErrors(err, req, res, next) {
    logger.error('Error occurred', {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
    });

    next(err);
  }

  // 2️⃣ Handle Sequelize validation errors
  function ormErrorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
      logger.warn('ORM Validation Error', {
        errors: err.errors.map((e) => e.message),
        method: req.method,
        url: req.originalUrl,
      });

      return res.status(409).json({
        statusCode: 409,
        message: err.name,
        errors: err.errors,
      });
    }

    next(err);
  }

  // 3️⃣ Handle Boom errors
  function boomErrorHandler(err, req, res, next) {
    if (err.isBoom) {
      const { output } = err;

      logger.warn('Boom Error', {
        statusCode: output.statusCode,
        payload: output.payload,
        method: req.method,
        url: req.originalUrl,
      });

      return res.status(output.statusCode).json(output.payload);
    }

    next(err);
  }

  // 4️⃣ Catch-all error handler
  function genericErrorHandler(err, req, res, _next) {
    logger.error('Unhandled Error', {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
    });

    res.status(err.status || 500).json({
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });
  }

  // 5️⃣ 404 Handler
  function notFoundHandler(req, res) {
    logger.warn('404 - Not Found', {
      method: req.method,
      url: req.originalUrl,
    });

    res.status(404).render('errors/404', {
      title: 'Page Not Found',
      sidebar: null,
    });
  }

  return {
    logErrors,
    ormErrorHandler,
    boomErrorHandler,
    genericErrorHandler,
    notFoundHandler,
  };
}

module.exports = createErrorHandlers;
