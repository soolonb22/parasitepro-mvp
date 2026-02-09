const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const client = new Client({ 
  connectionString, 
  ssl: { rejectUnauthorized: false } 
});

async function runSchema() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    const schema = fs.readFileSync('schema.sql', 'utf8');
    await client.query(schema);
    
    console.log('Schema executed successfully!');
    console.log('All tables created');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

runSchema();
