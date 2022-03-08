'use strict';

const dataNeracaKeuangan = require('../constant/neraca_keuangan-seeder');
const { NeracaKeuangan } = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
   await Promise.all(dataNeracaKeuangan.map(async (data) => {
      try {
        await NeracaKeuangan.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
   }));
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('neraca_keuangan', null, {});
  }
};
