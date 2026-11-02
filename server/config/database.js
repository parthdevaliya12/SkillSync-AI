const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL');
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.substring(0, 80), duration: `${duration}ms`, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

const getClient = async () => {
  return await pool.connect();
};

module.exports = { pool, query, getClient };
