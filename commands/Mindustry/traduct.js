const Discord = require('discord.js');
const fs = require('fs');
const GithubContent = require('github-content');

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {

    newError = botUtils.newError;

    try {

      const cmd = args.shift()
      const helpers = {
        textBR: fs.readFileSync('dataBank/MindustryTraductions/last.txt', 'utf8').split('\n'),
        textEN: fs.readFileSync('dataBank/MindustryTraductions/english.txt', 'utf8').split('\n'),
        regSep: new RegExp('^([^=]+)=(.+)$', 'i'),
        filePath: 'dataBank/MindustryTraductions/'
      };

      const aliases = {
        "proposal": ['proposta','propor'],
        "proposals": ['propostas']
      }

      let folder = fs.readdirSync(`./commands/Mindustry/Traduct`);
      let file = cmd?folder.filter(t => t.endsWith('.js')).find(t => {
        return t.slice(0,-3) == cmd.toLowerCase() || aliases[t.slice(0,-3)] && aliases[t.slice(0,-3)].includes(cmd.toLowerCase())
      }):'help.js';
      if (!file) return message.reply('Seu comando n foi achado')
      require('./Traduct/'+file).run(client,botUtils,message,args,helpers)

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
    name: "traduct",
    noalias: "Sem sinonimos",
    aliases: ['traduction', 'tradução', 'translate','tdc'],
    description: "Veja a tradução do mindustry e faça propostas",
    usage: "traduct <opção>",
    accessableby: "Membros"
  }
}