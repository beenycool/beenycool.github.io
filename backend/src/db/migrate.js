/**
 * Database migration script
 * Run with: node src/db/migrate.js
 */

const { sequelize } = require('./config');
const { User, ChessGame, ActivityLog, Guild } = require('../models');

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Sync all models with database
    // force: true will drop tables if they exist
    // Use with caution in production!
    const force = process.env.DB_FORCE_SYNC === 'true';
    
    if (force) {
      console.warn('WARNING: Force sync enabled - this will drop existing tables!');
    }
    
    await sequelize.sync({ force });
    
    console.log('Database migration completed successfully.');
    
    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error('Database migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrate(); 