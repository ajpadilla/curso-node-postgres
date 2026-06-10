class HealthReport {
  constructor({ status, details, uptime }) {
    this.status = status; // 'ok' | 'degraded' | 'down'
    this.details = details; // { db: 'connected', cache: 'down' }
    this.uptime = uptime; // seconds
  }
}

module.exports = HealthReport;
