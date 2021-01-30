const Discord = require("discord.js");
const { Users } = require("../../database.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    if (!botUtils.isDev(message.author.id)) return message.channel.send("You are not allowed to execute this command");

    newError = botUtils.newError;

    try {
      let user = message.mentions.users[0] || client.users.cache.get(args[0]) || message.author;

      Users.findById(user.id, (err, doc) => {
        if (err) {
          console.log("\n=> " + newError(err, "db", {user: user.id, server: message.guild.id, msg: message.id}));
          return;
        }

        if (!doc) {
          let newUser = new Users({ _id: user.id });
          newUser.save();

          message.channel.send("try again");
          return;
        }

        let embed = new Discord.MessageEmbed()
          .setTitle(user.tag)
          .setDescription(`\`\`\`json\n${JSON.stringify(doc, null, 2)}\n\`\`\``)
        message.channel.send(embed);
      });

    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle("UnexpectedError")
        .setDescription("An unexpected error has occurred. please contact the ADMs \ n \ nA log was created with more information about the error");
      message.channel.send(embed);

      let IDs = {
        server: message.guild.id,
        user: message.author.id,
        msg: message.id
      }
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "db",
    noalias: "No synonyms",
    aliases: [],
    description: "Check the information in the database",
    usage: "db [@usermention or userid]",
    accessableby: "Developers"
  }
}
