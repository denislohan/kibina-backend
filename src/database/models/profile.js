'use strict';
module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('profile', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    familyName: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    role:DataTypes.INTEGER
  }, {});
  profile.associate = function(models) {
    // associations can be defined here
  };
  return profile;
};