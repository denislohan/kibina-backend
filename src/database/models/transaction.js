'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    receiver: DataTypes.STRING,
    sender: DataTypes.STRING,
    amount: DataTypes.STRING,
    agent: DataTypes.INTEGER,
    referenceid: DataTypes.STRING,
    requesttransactionid: DataTypes.STRING,
    transactionid: DataTypes.STRING,
    profit: DataTypes.DOUBLE,
    companyProfit: DataTypes.DOUBLE

  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
  };
  return transaction;
};