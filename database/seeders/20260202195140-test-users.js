'use strict';

const {hash} = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const passwordHash = await hash('12345678', 10);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@test.com',
        password: passwordHash,
        role: 'admin',
        recovery_token: null,
        create_at: new Date()
      },
      {
        email: 'user@test.com',
        password: passwordHash,
        role: 'customer',
        recovery_token: null,
        create_at: new Date()
      },
      {
        email: 'qa@test.com',
        password: passwordHash,
        role: 'customer',
        recovery_token: null,
        create_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('users', {
      email: [
        'admin@test.com',
        'user@test.com',
        'qa@test.com'
      ]
    });

  }
};
