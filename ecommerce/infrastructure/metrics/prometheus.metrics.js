const client = require('prom-client');
const Metrics = require('../../../shared/domain/metrics.port');

class PrometheusMetrics extends Metrics {
  constructor() {
    super();

    this.counters = {};
    this.histograms = {};
    this.gauges = {};
  }

  increment(name, tags = {}) {
    if (!this.counters[name]) {
      this.counters[name] = new client.Counter({
        name,
        help: name,
        labelNames: Object.keys(tags),
      });
    }

    this.counters[name].inc(tags);
  }

  observe(name, value, tags = {}) {
    if (!this.histograms[name]) {
      const histogramOptions = {
        name,
        help: name,
        labelNames: Object.keys(tags),
      };

      // Special configuration for HTTP latency
      if (name === 'http_request_duration_seconds') {
        histogramOptions.buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5];
      }

      this.histograms[name] = new client.Histogram(histogramOptions);
    }

    this.histograms[name].observe(tags, value);
  }

  gauge(name, value, tags = {}) {
    if (!this.gauges[name]) {
      this.gauges[name] = new client.Gauge({
        name,
        help: name,
        labelNames: Object.keys(tags),
      });
    }

    this.gauges[name].set(tags, value);
  }
}

module.exports = PrometheusMetrics;
