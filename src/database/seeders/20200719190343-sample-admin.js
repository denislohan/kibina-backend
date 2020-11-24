'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profiles', [{
      firstName: 'General',
      familyName: 'Admin',
      role:'admin',
      username: 'admin@fastpesa.com',
      password:process.env.admin_seed_pass,
      balance:0,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      firstName: 'General',
      familyName: 'Agent',
      role:'agent',
      username: 'agent',
      password:process.env.agent_seed_pass,
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