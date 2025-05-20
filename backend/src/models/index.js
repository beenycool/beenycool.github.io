/**
 * Models index file
 * Exports all Sequelize models
 */

const { sequelize } = require('../db/config');
const User = require('./User');
const ChessGame = require('./ChessGame');
const ActivityLog = require('./ActivityLog');
const Guild = require('./Guild');
const UserSession = require('./UserSession');

// Create a models object to pass to associate functions
const models = {
  User,
  ChessGame,
  ActivityLog,
  Guild,
  UserSession
};

// Call associate methods on each model to set up relationships
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = {
  sequelize,
  ...models
}; 