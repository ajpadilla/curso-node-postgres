function createHttpLoggerHandler(logger) {
  function httpLogger(req, res, next) {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const durationNs = process.hrtime.bigint() - start;

      const durationMs = Number(durationNs) / 1000000;

      const durationSeconds = Number(durationNs) / 1000000000;

      logger.info('HTTP Request', {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,

        durationMs: Number(durationMs.toFixed(2)),

        durationSeconds: Number(durationSeconds.toFixed(3)),

        ip: req.ip,

        userAgent: req.headers['user-agent'],

        responseSize: res.get('content-length') || 0,
      });
    });

    next();
  }

  return {
    httpLogger,
  };
}

module.exports = createHttpLoggerHandler;
