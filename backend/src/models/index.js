/**
 * Models index file
 * Exports all Sequelize models
 */

const User = require('./User');
const ChessGame = require('./ChessGame');
const ActivityLog = require('./ActivityLog');
const Guild = require('./Guild');

module.exports = {
  User,
  ChessGame,
  ActivityLog,
  Guild
}; 