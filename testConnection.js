// testConnection.js

const pool = require('./dbConfig');

(async () => {
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to the database.');

    // Create a test table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      );
    `;
    await client.query(createTableQuery);
    console.log('Product table created successfully.');

    // Insert a test record
    const insertQuery = `
      INSERT INTO product (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = ['Sample Product', 'This is a sample product.'];
    const result = await client.query(insertQuery, values);
    console.log('Inserted record:', result.rows[0]);

    // Query the table
    const selectQuery = 'SELECT * FROM product;';
    const selectResult = await client.query(selectQuery);
    console.log('Current records in product table:', selectResult.rows);

    // Release the client back to the pool
    client.release();

    // End the pool to close all connections
    await pool.end();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
})();
