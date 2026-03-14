const mysql = require('mysql2/promise');

// Load environment variables if needed
require('dotenv').config();

const connectionUri = process.env.MYSQL_URL;

if (!connectionUri) {
  console.error("Error: MYSQL_URL environment variable not set.");
  process.exit(1);
}

// Create the connection pool
const pool = mysql.createPool({
  uri: connectionUri,
  waitForConnections: true,
  connectionLimit: 5, // Keep low for hobby tier
  queueLimit: 0,
});

// Test the connection
pool.getConnection()
  .then(conn => {
    console.log("Successfully connected to the PlanetScale database.");
    conn.release();
  })
  .catch(err => {
    console.error("Database connection failed: ", err.message);
  });

module.exports = pool;
