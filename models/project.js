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
  tableName: 'Projects', // Specify table name if needed
  timestamps: true, // Disable createdAt and updatedAt fields
  toJSON: {
    transform: (doc, ret) => {
      delete ret.createdAt;
      delete ret.updatedAt;
      if (ret.perimeter && ret.perimeter.crs) {
        delete ret.perimeter.crs;
      }
      return ret;
    }
  }
});

// Override the toJSON method to customize the JSON output
Project.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // Remove unwanted fields
  delete values.createdAt;
  delete values.updatedAt;

  // Remove 'crs' from 'perimeter' if it exists
  if (values.perimeter && values.perimeter.crs) {
    delete values.perimeter.crs;
  }

  return values;
};

module.exports = Project;
