"use strict";
const constantColumn = require("../constant/constant-column");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
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
      ...constantColumn(Sequelize),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
