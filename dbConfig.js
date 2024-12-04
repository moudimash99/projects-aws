// dbConfig.js

require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg');
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD) 
console.log(process.env.DB_NAME)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
  } : false,
});

module.exports = pool;
