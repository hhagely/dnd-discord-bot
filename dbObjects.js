const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db_dnd-helper.sqlite',
});

const Banks = sequelize.import('models/Banks');
const BankTransactions = sequelize.import('models/BankTransactions');

BankTransactions.belongsTo(Banks, { foreignKey: 'bankId', as: 'bank' });

module.exports = {
  Banks,
  BankTransactions,
};
