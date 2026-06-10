// ecommerce/infrastructure/http/middlewares/observability/metrics.middleware.js
function createMetricsMiddleware({ metrics }) {
  function metricsMiddleware(req, res, next) {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const duration = Number(process.hrtime.bigint() - start) / 1e9;

      const route = req.baseUrl + (req.route?.path || '');

      const labels = {
        method: req.method,
        route,
        status: String(res.statusCode),
      };

      metrics.increment('http_requests_total', labels);

      metrics.observe('http_request_duration_seconds', duration, labels);
    });

    next();
  }

  return { metricsMiddleware };
}

module.exports = createMetricsMiddleware;
