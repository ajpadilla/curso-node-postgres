// shared/domain/metrics/metrics.port.js
class Metrics {
  increment(name, _tags = {}) {
    throw new Error('Not implemented');
  }

  observe(name, value, _tags = {}) {
    throw new Error('Not implemented');
  }

  gauge(name, value, _tags = {}) {
    throw new Error('Not implemented');
  }
}

module.exports = Metrics;
