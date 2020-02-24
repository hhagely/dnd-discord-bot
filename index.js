const { AkairoClient } = require('discord-akairo');
const auth = require('./auth');

const client = new AkairoClient(
  {
    ownerID: '144606974758092801',
    prefix: '~',
    commandDirectory: './commands',
    listenerDirectory: './listeners',
  },
  {
    disableEveryone: false,
  }
);

client.login(auth.token);
