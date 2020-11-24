'use strict';
module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('rate', {
    companyFees: DataTypes.DOUBLE,
    agentFees:  DataTypes.DOUBLE,
    currency:  DataTypes.DOUBLE,
    profitToRedeem: DataTypes.DOUBLE,
    currency: DataTypes.DOUBLE,
  }, {});
  profile.associate = function(models) {
    // associations can be defined here
  };
  return profile;
};