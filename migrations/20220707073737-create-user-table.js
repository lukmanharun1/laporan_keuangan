"use strict";
const field = require("../constant/field");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "user",
      field(Sequelize, {
        nama_lengkap: {
          type: Sequelize.STRING(128),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(128),
          primaryKey: true,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        role: {
          type: Sequelize.ENUM("admin", "user"),
          allowNull: false,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
