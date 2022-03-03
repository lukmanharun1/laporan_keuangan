'use strict';
const constantColumn = require('../constant/constant-column');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('laporan_keuangan', {
      emiten_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false
      },
      jenis_laporan: {
        type: Sequelize.ENUM('Q1', 'Q2', 'Q3', 'TAHUNAN'),
        allowNull: false
      },
      harga_saham: {
        type: Sequelize.INTEGER(6),
        allowNull: false,
      },
      nama_file: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      ...constantColumn(Sequelize)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('laporan_keuangan');
  }
};
