'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Departments', 'perimeter', {
      type: Sequelize.GEOMETRY('MULTIPOLYGON'), // Changes to MULTIPOLYGON
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Departments', 'perimeter', {
      type: Sequelize.GEOMETRY('POLYGON'), // Reverts to POLYGON
      allowNull: false,
    });
  }
};
