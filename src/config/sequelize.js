require('dotenv').config();
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./database')[env];

const DEFINE = {
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const POOL = config.pool || { max: 10, min: 0, acquire: 30000, idle: 10000 };

/**
 * Bulutli provayderlarda (Render, Neon, Supabase, RDS...) ulanish SSL talab qiladi,
 * Render'ning ichki (internal) ulanishida esa SSL kerak emas.
 * `DB_SSL=true|false` bilan majburan boshqarish mumkin.
 */
function shouldUseSsl(url, explicit) {
  if (explicit === 'false') return false;
  if (explicit === 'true') return true;
  if (!url) return false;
  if (/sslmode=require/i.test(url)) return true;
  if (/\.render\.com|\.neon\.tech|\.supabase\.co|amazonaws\.com|\.azure\.com/i.test(url)) {
    return true;
  }
  // Render ichki host (masalan dpg-xxxx-a) yoki localhost — SSL yo'q
  return false;
}

let sequelize;

if (process.env.DATABASE_URL) {
  const useSsl = shouldUseSsl(process.env.DATABASE_URL, process.env.DB_SSL);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: config.logging,
    define: DEFINE,
    pool: POOL,
    dialectOptions: useSsl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    define: DEFINE,
    pool: POOL,
  });
}

module.exports = sequelize;
