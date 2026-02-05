const { pool } = require('./postgres.pool');
const { getConnection } = require('./postgres.client');

module.exports = {
  pool,
  getConnection,
};
