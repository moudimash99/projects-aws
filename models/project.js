// models/project.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  perimeter: {
    type: DataTypes.GEOMETRY('POLYGON'), // Using PostGIS geometry type
    allowNull: false,
  },
}, {
  tableName: 'projects', // Specify table name if needed
  timestamps: false, // Disable createdAt and updatedAt fields
});

module.exports = Project;
