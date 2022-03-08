'use strict';

const dataArusKas = require('../constant/arus_kas-seeder');
const { ArusKas } = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
   await Promise.all(dataArusKas.map(async (data) => {
      try {
        await ArusKas.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
   }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('arus_kas', null, {});
  }
};
