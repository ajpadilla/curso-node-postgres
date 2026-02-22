const express = require('express');

class MetricsRouter {
  constructor({ metricsClient }) {
    this.router = express.Router();
    this.metricsClient = metricsClient;

    this.init();
  }

  init() {
    this.router.get('/', this.metrics.bind(this)); // <- just '/'
  }

  async metrics(_, res) {
    res.set('Content-Type', this.metricsClient.register.contentType);
    res.send(await this.metricsClient.register.metrics());
  }

  getRouter() {
    return this.router;
  }
}

module.exports = MetricsRouter;
