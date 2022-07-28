"use strict";

const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "emiten",
      field(Sequelize, {
        jumlah_saham: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        kode_emiten: {
          type: Sequelize.STRING(4),
          allowNull: false,
          unique: true,
        },
        nama_emiten: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("emiten");
  },
};
