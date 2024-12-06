const sequelize = require('../config/database');
const Project = require('./project');
const Department = require('./department');
const db = {};

db.Sequelize = sequelize;
db.Project = Project;
db.Department = Department;

module.exports = db;