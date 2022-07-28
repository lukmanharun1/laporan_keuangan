"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "arus_kas",
      field(Sequelize, {
        operasi: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        investasi: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        pendanaan: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("arus_kas");
  },
};
