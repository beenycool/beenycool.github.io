const { Sequelize } = require('sequelize');
require('dotenv').config();

// Parse DATABASE_URL if available (Render provides this for PostgreSQL)
let sequelize;

if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL from environment');
  // Use the DATABASE_URL provided by Render
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For Render's self-signed certificate
      }
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log
  });
} else {
  // Local development configuration
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = process.env.DB_PORT || 5432;
  const DB_NAME = process.env.DB_NAME || 'beenycool';
  const DB_USER = process.env.DB_USER || 'postgres';
  const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
  
  console.log(`Using local PostgreSQL connection: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production' ? false : console.log
  });
}

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
    return false;
  }
}

module.exports = { sequelize, testConnection }; 