const config = require('../../config.json');
const Discord = require('discord.js');
prefix = config.prefix;

module.exports = async ({ client, botUtils }, message) => {
  newError = botUtils.newError;

  try {
    let messageArray = message.content.split(/ +/);
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    // Adiciona na tabela de frequencia
    botUtils.jsonChange('./dataBank/mesTotal.json', obj => {
      if(message.guild && message.guild.id != "699823229354639471") return obj;

      obj.messages[0] = obj.messages[0] || {};
      obj.messages[0][message.author.id] =
        (obj.messages[0][message.author.id] || 0) + 1;
      return obj;
    }, 1);

    // Ignora mensagens de bot
    if (message.author.bot) return;

    // detecta schematicas
    let schem = message.attachments.find(a => a.name.endsWith(".msch"));
    if (schem) return require("./Utils/scheme.js")(client, botUtils,message,schem);
    if(!require("./Utils/schemeMes.js")(client, botUtils,message,message.content)) return;
    
    // tudo oq n possui prefixo é ignorado
    if (!message.content.startsWith(prefix)) return;

    // gambiarra do king
    let commandfile =
      client.commands.get(cmd.slice(prefix.length)) ||
      client.commands.get(client.aliases.get(cmd.slice(prefix.length)));

    if (commandfile) commandfile.run(client, botUtils, message, args);
  } catch (err) {
    let IDs = {
      server: message.channel.id,
      user: message.author.id,
      msg: message.id
    };
    console.log(`=> ${newError(err, 'ClientMessage', IDs)}`);
  }
};
