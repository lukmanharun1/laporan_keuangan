'use strict';

const dataLaporanKeuangan = require('../constant/laporan_keuangan-seeder');
const { LaporanKeuangan } = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
   await Promise.all(dataLaporanKeuangan.map(async (data) => {
      try {
        await LaporanKeuangan.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
   }));
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('laporan_keuangan', null, {});
  }
};
