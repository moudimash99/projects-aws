// models/index.js

const sequelize = require('../config/database');
const Project = require('./project');

const db = {};

db.Sequelize = sequelize;
db.Project = Project;

module.exports = db;
