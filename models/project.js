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
    type: DataTypes.GEOMETRY('POLYGON'), 
    allowNull: false,
  },
}, {
  tableName: 'Projects', 
  timestamps: true, 
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

Project.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.createdAt;
  delete values.updatedAt;

  if (values.perimeter && values.perimeter.crs) {
    delete values.perimeter.crs;
  }

  return values;
};

module.exports = Project;