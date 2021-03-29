const { Users } = require('../../../database.js');
const botUtils = require("../../../utils.js");
const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 */
module.exports = (client, message) => {
  newError = botUtils.newError;

  try {
    // detecta os mini eventos
    if (message.author.bot) return;

    botUtils.jsonChange(
      './dataBank/serverState.json', obj => {
        if (obj.eventType === null) {
          message.delete();
          return;
        }

        let correct = false;

        if (Array.isArray(obj.eventWin)) {
          const values = message.content.match(/\-?\d+/g);

          if (values && values.length == obj.eventWin.length) {
            values.sort();
            correct = !values.some((element, index) => {
              return element != obj.eventWin[index];
            });
          }
        } else {
          correct = message.content.toLowerCase() == obj.eventWin;
        }

        if (correct) {

          // constantes 
          const money = Math.floor(Math.random() * 5 + 5);
          const xp = Math.floor(Math.random() * 50 + 100);

          // Configura o Canal
          message.channel.send(`\`${message.author.tag}\` respondeu certo! ganhou ${money}\$ e ${xp} xp`);
          message.channel.overwritePermissions([
            { id: '700183808783286372', allow: 805829713 },
            { id: '755665930159390721', deny: 2112 },
            { id: '699823229354639471', allow: 66624, deny: 805763089 }
          ]);
          message.react('✅');
          obj.eventWin = null;
          obj.eventType = null;

          // Configura

          Users.findById(message.author.id, (err, doc) => {
            if (err) {
              console.log(
                '\n=> ' +
                newError(err, 'utils_updateDBxp', { user: message.author.id })
              );
              return;
            }

            if (!doc) doc = new Users({ _id: message.author.id });

            doc.txp += xp;
            doc.money += money;
            doc.save();
          });

        } else {

          const emojis = [
            '<:burro:825090955954225152>',
            ['😡','❌'],
            '❌'
          ];
          const weigths = [
            1,
            1,
            28
          ];

          let number = Math.floor(Math.random() * weigths.reduce((a, b) => a + b));
          emojis.some((emoji, i) => {
            number -= weigths[i];
            if (number < 0) {
              if (Array.isArray(emoji))
                return emoji.reduce((_,str) => _.then(message.react(str)), Promise.resolve());
              else
                return message.react(emoji);
            }
          })
        }

        return obj;
      }, 5
    );
  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    };
    console.log(`=> ${newError(err, 'ClientMessage_Minieventos', IDs)}`);
  }
};
