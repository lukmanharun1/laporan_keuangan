'use strict';
const constantColumn = require('../constant/constant-column');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('laba_rugi', {
      pendapatan: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      laba_kotor: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      laba_usaha: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      laba_sebelum_pajak: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      laba_bersih: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      ...constantColumn(Sequelize)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('laba_rugi');
  }
};
