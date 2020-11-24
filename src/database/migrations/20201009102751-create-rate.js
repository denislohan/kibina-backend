'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currency: { // conversion rate MZN <> RWF
        type: Sequelize.DOUBLE
      },
      companyFees: {   //%
        type: Sequelize.DOUBLE
      },
      agentFees: { // %
        type: Sequelize.DOUBLE
      },
      profitToRedeem: {  // folds(times) of collected profir
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rates');
  }
};