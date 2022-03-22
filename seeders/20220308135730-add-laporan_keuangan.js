'use strict';

const dataLaporanKeuangan = require('../constant/laporan_keuangan-seeder');
const { LaporanKeuangan, NeracaKeuangan, LabaRugi, ArusKas, Dividen } = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
    // creeate laporan keuangan
    await Promise.all(dataLaporanKeuangan.laporan_keuangan.map(async (data) => {
        try {
          await LaporanKeuangan.findOrCreate({
            where: data,
            defaults: data
          });
        } catch (error) {
          console.log(error);
        }
    }));

    //  create neraca keuangan
    await Promise.all(dataLaporanKeuangan.neraca_keuangan.map(async (data) => {
      try {
        await NeracaKeuangan.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
    }));
    // create laba rugi
    await Promise.all(dataLaporanKeuangan.laba_rugi.map(async (data) => {
      try {
        await LabaRugi.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
    }));
    // create arus kas
    await Promise.all(dataLaporanKeuangan.arus_kas.map(async (data) => {
      try {
        await ArusKas.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
    }));
    // create dividen
    await Promise.all(dataLaporanKeuangan.dividen.map(async (data) => {
      try {
        await Dividen.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.bulkDelete('laporan_keuangan', null, {}),
      queryInterface.bulkDelete('neraca_keuangan', null, {}),
      queryInterface.bulkDelete('laba_rugi', null, {}),
      queryInterface.bulkDelete('arus_kas', null, {}),
      queryInterface.bulkDelete('dividen', null, {}),
    ]);
  }
};
