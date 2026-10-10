const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./database')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    define: config.define,
    pool: config.pool || { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

module.exports = sequelize;
