const { Sequelize } = require('sequelize');

const { config } = require('../config/env');
const { setupModels } = require('./models');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: false,
});

setupModels(sequelize);
//sequelize.sync();

module.exports = {
  sequelize,
};
