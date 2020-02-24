module.exports = (sequelize, DataTypes) =>
  sequelize.define('banks', {
    campaign: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  });
