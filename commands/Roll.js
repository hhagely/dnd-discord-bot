const { Command } = require('discord-akairo');
const { RichEmbed } = require('discord.js');

class Roll extends Command {
  constructor() {
    super('roll', {
      aliases: ['roll'],
      split: 'plain',
      args: [
        {
          id: 'campaign',
          type: 'lowercase',
        },
        {
          id: 'diceRoll',
          type: 'lowercase',
        },
      ],
    });
  }

  async exec(message, args) {
    const channel = message.guild.channels.find(
      c =>
        c.name === 'dice-rolls' &&
        c.parent.name.toLowerCase().includes(args.campaign)
    );

    const messageAuthorNick = message.member.nickname;
    const diceRegex = /^(\d+)?d(\d+)([+-]\d+)?$/;

    const matchResult = diceRegex.exec(args.diceRoll);

    if (!matchResult) {
      message.reply('Invalid dice roll: ', args.diceRoll);
    }

    const rollNumber = matchResult[1];
    const dieSides = matchResult[2];
    const modifier = matchResult[3];
    const diceRolls = await this.rollDice(rollNumber, dieSides);
    let rollSum = diceRolls.reduce((prev, curr) => prev + curr);

    let modAmount;
    if (modifier !== undefined) {
      modAmount = parseInt(modifier.substr(1));
      // eslint-disable-next-line no-eval
      rollSum = eval(`${rollSum} ${modifier}`);
      if (rollSum < 1) {
        rollSum = 1;
      }
    }

    const embed = this.buildEmbed(
      args.diceRoll,
      messageAuthorNick,
      diceRolls,
      rollSum,
      modAmount
    );

    channel.send(embed);
  }

  async rollDice(rollNum, diceSides) {
    const diceArray = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= rollNum; i++) {
      const random = Math.random() * (diceSides - 1 + 1) + 1;
      const diceRoll = Math.floor(random);

      diceArray.push(diceRoll);
    }

    return diceArray;
  }

  buildEmbed(input, authorNickname, diceRolls, sum, modifierAmount) {
    const embed = new RichEmbed()
      .setTitle(`Dice Roll`)
      .setColor('RANDOM')
      .addField('Player', authorNickname, true)
      .addField('Rolled', input, true)
      .addField('Results', diceRolls.join(' + '), false);

    if (modifierAmount !== undefined) {
      embed.addField('Roll Modifier', modifierAmount, false);
    }

    embed.addField('Total Damage', sum, false);

    return embed;
  }
}

module.exports = Roll;
