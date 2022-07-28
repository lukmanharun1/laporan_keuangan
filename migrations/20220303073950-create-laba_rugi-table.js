"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "laba_rugi",
      field(Sequelize, {
        pendapatan: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        laba_kotor: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        laba_usaha: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        laba_sebelum_pajak: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        laba_bersih: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("laba_rugi");
  },
};
