const { Pool } = require('pg');
const { config } = require('../config/env');

const USER = encodeURIComponent(config.db.user);
const PASSWORD = encodeURIComponent(config.db.password);
const URI = `postgres://${USER}:${PASSWORD}@${config.db.host}:${config.db.port}/${config.db.name}`;

const pool = new Pool({ connectionString: URI });

module.exports = { pool };
