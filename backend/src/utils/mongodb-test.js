/**
 * MongoDB connection test utility
 * This file can be run directly to test MongoDB connection
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Get MongoDB URI from environment or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beenycool';

// Mask credentials in logs
function maskUri(uri) {
  if (!uri) return 'undefined';
  return uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:***@');
}

console.log(`Attempting to connect to MongoDB at ${maskUri(MONGODB_URI)}`);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Connection state:', mongoose.connection.readyState);
    
    // List collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('Collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Close connection
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// If the script runs for more than 10 seconds without resolving, exit
setTimeout(() => {
  console.error('Connection attempt timed out after 10 seconds');
  process.exit(1);
}, 10000); 