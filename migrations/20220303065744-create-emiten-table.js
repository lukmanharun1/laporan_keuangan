'use strict';

const constantColumn = require('../constant/constant-column');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('emiten', {
      jumlah_saham: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      kode_emiten: {
        type: Sequelize.STRING(4),
        allowNull: false,
        unique: true
      },
      nama_emiten: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: 'true'
      },
      ...constantColumn(Sequelize)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('emiten');
  }
};
