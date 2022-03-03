'use strict';
const constantColumn = require('../constant/constant-column');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('dividen', {
      cash: {
        type: Sequelize.INTEGER(6),
        allowNull: false
      },
      ...constantColumn(Sequelize)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('dividen');
  }
};
