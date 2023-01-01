'use strict';

const dataUserPromises = require('../constant/users_seeder');
const { User } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    // creeate user
    const dataUsers = await dataUserPromises()
    await Promise.all(dataUsers.map(async (data) => {
        try {
          await User.findOrCreate({
            where: data,
            defaults: data
          });
        } catch (error) {
          console.log(error);
        }
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};