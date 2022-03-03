'use strict';
const constantColumn = require('../constant-column');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('neraca_keuangan', {
      aset: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      kas_dan_setara_kas: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      piutang: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      persediaan: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      aset_lancar: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      aset_tidak_lancar: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      liabilitas_jangka_pendek: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      liabilitas_jangka_panjang: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      liabilitas_berbunga: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      ekuitas: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      ...constantColumn(Sequelize)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('neraca_keuangan');
  }
};
