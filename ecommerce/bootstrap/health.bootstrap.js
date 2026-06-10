const { sequelize } = require('../../database/sequelize');

const DatabaseHealthIndicator = require('../../shared/application/health/db.health-indicator');

const HealthService = require('../../shared/application/health/health.service');

const HealthRouter = require('../infrastructure/http/routes/health/health.router');

module.exports = function bootstrapHealth() {
  const dbIndicator = new DatabaseHealthIndicator({
    sequelize,
  });

  const healthService = new HealthService({
    indicators: [dbIndicator],
  });

  const healthRouter = new HealthRouter({
    healthService,
  });

  return {
    healthRouter,
    healthService,
  };
};
