const HealthIndicator = require('./health-indicator');

class DatabaseHealthIndicator extends HealthIndicator {
  constructor({ sequelize }) {
    super();
    this.name = 'db';
    this.sequelize = sequelize;
  }

  async check() {
    await this.sequelize.authenticate();
    return 'connected';
  }
}

module.exports = DatabaseHealthIndicator;
