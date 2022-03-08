'use strict';

const dataEmiten = require('../constant/emiten_seeder');
const { Emiten } = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
   await Promise.all(dataEmiten.map(async (data) => {
      try {
        await Emiten.findOrCreate({
          where: data,
          defaults: data
        });
      } catch (error) {
        console.log(error);
      }
   }));
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('emiten', null, {});
  }
};
