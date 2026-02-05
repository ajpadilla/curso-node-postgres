require('dotenv').config();

const env = {
  env: process.env.NODE_ENV || 'development',

  port: process.env.PORT || 3000,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5532,
    user: process.env.DB_USER || 'nico',
    password: process.env.DB_PASSWORD || 'admin123',
    name: process.env.DB_NAME || 'my_store',
  },

  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = { config: env };
