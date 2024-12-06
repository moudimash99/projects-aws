// migrations/[timestamp]-create-project.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Projects', {
      id: {
        type: Sequelize.INTEGER, // Simple integer ID
        autoIncrement: true, // Automatically increment the ID
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
    await queryInterface.dropTable('Projects');
  },
};
