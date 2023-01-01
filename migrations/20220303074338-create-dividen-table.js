"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "dividen",
      field(Sequelize, {
        cash: {
          type: Sequelize.DECIMAL(6, 2),
          allowNull: false,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("dividen");
  },
};
