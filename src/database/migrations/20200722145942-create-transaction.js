'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      receiver: {
        type: Sequelize.STRING
      },
      sender: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      agent: {
        type: Sequelize.INTEGER
      },
      referenceid: {
        type: Sequelize.STRING
      },
      requesttransactionid: {
        type: Sequelize.STRING
      },
      transactionid: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('transactions');
  }
};