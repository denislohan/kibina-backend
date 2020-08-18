'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profiles', [{
      firstName: 'Olivier',
      familyName: 'Kwizera',
      role:'admin',
      username: 'oli-moz@kibina.com',
      password:'$2b$10$nV9hF8sbtt9i31DHsLxvP.Cq65S98OXAfXU55QoZGuz/JvBTfvJWi',
      balance:0,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      firstName: 'Titi',
      familyName: 'Innocent',
      role:'agent',
      username: 'titi',
      password:'$2b$10$nV9hF8sbtt9i31DHsLxvP.Cq65S98OXAfXU55QoZGuz/JvBTfvJWi',
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