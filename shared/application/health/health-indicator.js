class HealthIndicator {
  constructor(name) {
    this.name = name;
  }

  async check() {
    throw new Error('Not implemented');
  }
}

module.exports = HealthIndicator;
