const Discord = require("discord.js");
const os = require('os');
const cpuStat = require("cpu-stat");
const fetch = require("node-superfetch");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      cpuStat.usagePercent(async function(err, percent, seconds) {
        if (err) {
          return console.log(err);
        }

        let embedStats = new Discord.MessageEmbed()
          .setTitle("** :gear: | Canvas Module Host info **")
          .setColor("DodgerBlue2")
          .addField("• Memoria usada", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
          .addField("• Versão do Discord.js", `v${Discord.version}`, true)
          .addField("• Plataforma", `\`\`${os.platform()} ${os.arch()}\`\``, true)
          .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
          .addField("• CPU usada", `\`${percent.toFixed(2)}%\``, true)
        message.channel.send(embedStats);
      })
    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle("Erro inesperado")
        .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
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
    name: "stats",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Veja o status da host",
    usage: "stats",
    accessableby: "Membros"
  }
}