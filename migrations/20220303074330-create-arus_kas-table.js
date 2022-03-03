'use strict';
const constantColumn = require('../constant/constant-column');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('arus_kas', {
      operasi: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      investasi: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      pendanaan: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      ...constantColumn(Sequelize)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('arus_kas');
  }
};
