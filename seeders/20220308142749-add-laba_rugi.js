'use strict';

const dataLabaRugi = require('../constant/laba_rugi-seeder');
const { LabaRugi } = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
   await Promise.all(dataLabaRugi.map(async (data) => {
      try {
        await LabaRugi.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
   }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('laba_rugi', null, {});
  }
};
