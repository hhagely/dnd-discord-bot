const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db_dnd-helper.sqlite',
});

const Banks = sequelize.import('models/Banks');
sequelize.import('models/BankTransactions');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize
  .sync({ force })
  .then(async () => {
    const banks = [
      Banks.create({ campaign: 'chult', balance: 0 }),
      Banks.create({ campaign: 'waterdeep', balance: 0 }),
    ];

    await Promise.all(banks);
    console.log('Database synced!');
    sequelize.close();
  })
  .catch(console.error);
