const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function init() {
  try {
    const connectionUri = process.env.MYSQL_URL;
    if (!connectionUri) {
        throw new Error("MYSQL_URL environment variable is missing.");
    }

    const connection = await mysql.createConnection({
        uri: connectionUri,
        multipleStatements: true
    });
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Initializing database tables...');
    
    // Splitting by standard semicolon
    const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    for(const stmt of statements) {
        try {
            await connection.query(stmt);
        } catch(e) {
            // Ignore if table already exists, log others
            if (e.code !== 'ER_TABLE_EXISTS_ERROR') {
                console.error("Error running statement:", stmt, e);
            } else {
                console.log("Table already exists, skipping...");
            }
        }
    }
    
    console.log('Database schema executed successfully.');
    await connection.end();
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

init();
