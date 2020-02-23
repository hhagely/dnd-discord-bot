const { AkairoClient } = require('discord-akairo');

const client = new AkairoClient(
  {
    ownerID: '144606974758092801',
    prefix: '~',
    commandDirectory: '/commands',
  },
  {
    disableEveryone: false,
  }
);
const auth = require('./auth');

client.login(auth.token);
