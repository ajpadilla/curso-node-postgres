// shared/infrastructure/metrics/prometheus.metrics.js
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
        labelNames: Object.keys(tags)
      });
    }

    this.counters[name].inc(tags);
  }

  observe(name, value, tags = {}) {
    if (!this.histograms[name]) {
      this.histograms[name] = new client.Histogram({
        name,
        help: name,
        labelNames: Object.keys(tags)
      });
    }

    this.histograms[name].observe(tags, value);
  }

  gauge(name, value, tags = {}) {
    if (!this.gauges[name]) {
      this.gauges[name] = new client.Gauge({
        name,
        help: name,
        labelNames: Object.keys(tags)
      });
    }

    this.gauges[name].set(tags, value);
  }
}

module.exports = PrometheusMetrics;
