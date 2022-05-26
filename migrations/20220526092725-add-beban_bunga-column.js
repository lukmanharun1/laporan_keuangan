"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("laba_rugi", "beban_bunga", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("laba_rugi", "beban_bunga");
  },
};
