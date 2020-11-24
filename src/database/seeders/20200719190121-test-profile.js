'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profiles', [{
      firstName: 'Test',
      familyName: 'Admin',
      role:'admin',
      username: 'admin',
      password:'$2b$10$lWIE0LI8iLKOBgSGT7tbV.3yRVpG4TKCXCwpihRHYMhsKRnonDzoa',
      balance:0,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      firstName: 'Tess',
      familyName: 'Agent',
      role:'agent',
      username: 'agent',
      password:'$2b$10$lWIE0LI8iLKOBgSGT7tbV.3yRVpG4TKCXCwpihRHYMhsKRnonDzoa',
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