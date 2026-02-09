// ecommerce/infrastructure/http/middlewares/observability/metrics.middleware.js
function createMetricsMiddleware({ metrics }) {
  function metricsMiddleware(req, res, next) {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const duration =
        Number(process.hrtime.bigint() - start) / 1e6;

      metrics.increment('http_requests_total', {
        method: req.method,
        route: req.route?.path || 'unknown',
        status: res.statusCode
      });

      metrics.observe('http_request_duration_ms', duration, {
        method: req.method,
        status: res.statusCode
      });
    });

    next();
  }

  return { metricsMiddleware };
}

module.exports = createMetricsMiddleware;
