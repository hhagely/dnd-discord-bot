module.exports = (sequelize, DataTypes) =>
  sequelize.define('bankTransactions', {
    bankId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    operation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
