const client = require('prom-client');

const PrometheusMetrics = require('../infrastructure/metrics/prometheus.metrics');

const createMetricsMiddleware = require('../infrastructure/http/middlewares/observability/metrics.middleware');

const MetricsRouter = require('../infrastructure/http/routes/metrics/metrics.router');

module.exports = function bootstrapMetrics() {
  const metrics = new PrometheusMetrics();

  const metricsMiddleware = createMetricsMiddleware({
    metrics,
  });

  const metricsRouter = new MetricsRouter({
    metricsClient: client,
  });

  return {
    metrics,
    metricsRouter,
    middlewares: {
      metricsMiddleware: metricsMiddleware.metricsMiddleware,
    },
  };
};
