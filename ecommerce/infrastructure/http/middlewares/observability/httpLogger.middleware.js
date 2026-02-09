function createHttpLoggerHandler(logger) {
   function httpLogger(req, res, next) {

    const start = Date.now();

    res.on('finish', () => {
      logger.info('HTTP Request', {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    });

    next();
  }

  return {
     httpLogger
  }
}

module.exports = createHttpLoggerHandler;
