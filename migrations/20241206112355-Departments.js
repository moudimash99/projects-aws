
// migrations/[timestamp]-create-project.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Departments', {
      code: {
        type: Sequelize.INTEGER, // Simple integer ID
      
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      perimeter: {
        type: Sequelize.GEOMETRY('POLYGON', 4326),
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Departments');
  },
};
