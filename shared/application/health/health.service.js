const HealthReport = require('./health-report');

class HealthService {
  constructor({ indicators }) {
    this.indicators = indicators;
  }

  async check() {
    const details = {};
    let status = 'ok';

    for (const indicator of this.indicators) {
      try {
        details[indicator.name] = await indicator.check();
      } catch (error) {
        details[indicator.name] = 'down';
        status = 'degraded';
      }
    }

    return new HealthReport({
      status,
      details,
      uptime: Math.floor(process.uptime()),
    });
  }
}

module.exports = HealthService;
