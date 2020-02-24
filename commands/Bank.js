const { Command } = require('discord-akairo');
const { RichEmbed } = require('discord.js');
const { Op } = require('sequelize');
const { Banks, BankTransactions } = require('../dbObjects');

class Bank extends Command {
  constructor() {
    super('bank', {
      aliases: ['bank', 'vault', 'wallet'],
      split: 'quoted',
      args: [
        {
          id: 'campaign',
          type: 'lowercase',
        },
        {
          id: 'action',
          type: 'lowercase',
          default: 'balance',
        },
        {
          id: 'amount',
          type: 'number',
          default: 0,
        },
        {
          id: 'reason',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async exec(message, args) {
    const bank = await Banks.findOne({
      where: { campaign: { [Op.like]: args.campaign } },
    });

    const channel = message.guild.channels.find(c => c.name === 'bot-testing');

    const messageAuthorNick = message.member.nickname;

    switch (args.action) {
      case 'balance':
        this.balance(channel, bank);
        break;
      case 'deposit':
        this.deposit(channel, messageAuthorNick, args, bank);
        break;
      case 'withdraw':
        this.withdraw(channel, messageAuthorNick, args, bank);
        break;
      default:
        this.balance(channel, bank);
        break;
    }
  }

  async deposit(channel, authorNickname, args, bank) {
    try {
      await BankTransactions.create({
        bankId: bank.id,
        operation: args.action,
        amount: args.amount,
        performedBy: authorNickname,
      });
    } catch (e) {
      console.error(e);
    }

    bank.balance += args.amount;
    try {
      await bank.save();
      const embed = this.buildEmbed(args, authorNickname, bank.balance);

      channel.send(embed);
    } catch (e) {
      console.error(e);
    }
  }

  async withdraw(channel, authorNickname, args, bank) {
    try {
      await BankTransactions.create({
        bankId: bank.id,
        operation: args.action,
        amount: args.amount,
        performedBy: authorNickname,
      });
    } catch (e) {
      console.error(e);
    }

    bank.balance -= args.amount;
    try {
      await bank.save();
      const embed = this.buildEmbed(args, authorNickname, bank.balance);

      channel.send(embed);
    } catch (e) {
      console.error(e);
    }
  }

  async balance(channel, bank) {
    const embed = new RichEmbed()
      .setTitle(`Party Treasury`)
      .setColor('RANDOM')
      .addField('Current Treasury Balance', bank.balance);

    channel.send(embed);
  }

  buildEmbed(args, authorNickname, bankBalance) {
    const embed = new RichEmbed()
      .setTitle(`Party Treasury`)
      .setColor('RANDOM')
      .addField('Operation', args.action, true)
      .addField('Amount', args.amount, true)
      .addField('Made by: ', authorNickname, true);

    if (args.reason.length > 0) {
      embed.addField('Reason', args.reason, false);
    }

    embed
      .addBlankField()
      .addField('New Treasury Balance', bankBalance, false)
      .setTimestamp();

    return embed;
  }
}

module.exports = Bank;
