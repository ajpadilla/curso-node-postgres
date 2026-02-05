const { Client } = require('pg');
const { config } = require('../config/env');

const getConnection = async () => {
  const client = new Client({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });

  await client.connect();
  return client;
};

module.exports = { getConnection };
