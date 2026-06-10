const express = require('express');

class HealthRouter {
  constructor({ healthService }) {
    this.router = express.Router();
    this.healthService = healthService;

    this.init();
  }

  init() {
    this.router.get('/', this.health.bind(this));
  }

  async health(_, res) {
    const report = await this.healthService.check();
    res.status(report.status === 'ok' ? 200 : 503).json({
      status: report.status,
      ...report.details,
      uptime: report.uptime,
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = HealthRouter;
