'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profiles', [{
      firstName: 'Test',
      familyName: 'Admin',
      role:'admin',
      username: 'admin',
      password:process.env.test_pass,
      balance:0,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      firstName: 'Tess',
      familyName: 'Agent',
      role:'agent',
      username: 'agent',
      password:process.env.test_pass,
      balance:0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profiles', null, {});
  }
};