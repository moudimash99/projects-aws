// dbConfig.js

require('dotenv').config();
const { Pool } = require('pg');
console.log(env)
const pool2 = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

module.exports = pool2;

await pool2.connect();
// testConnection.js
