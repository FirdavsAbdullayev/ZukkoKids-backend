/**
 * PostgreSQL bazasini avtomatik yaratadi (agar mavjud bo'lmasa).
 * Ishlatish: npm run db:init
 */
require('dotenv').config();
const { Client } = require('pg');

const DB_NAME = process.env.DB_NAME || 'zukkokids';

async function initDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // default DB orqali ulanamiz
  });

  try {
    await client.connect();

    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if (res.rowCount > 0) {
      console.log(`✅ "${DB_NAME}" bazasi allaqachon mavjud.`);
    } else {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`🎉 "${DB_NAME}" bazasi yaratildi!`);
    }
  } catch (err) {
    console.error('❌ Bazani yaratishda xatolik:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

initDatabase();
