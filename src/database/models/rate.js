'use strict';
module.exports = (sequelize, DataTypes) => {
  const rate = sequelize.define('rate', {
    currency: DataTypes.DOUBLE,
    companyFees: DataTypes.DOUBLE,
    agentFees: DataTypes.DOUBLE
  }, {});
  rate.associate = function(models) {
    // associations can be defined here
  };
  return rate;
};