const Discord = require("discord.js");


//fica mais prático pra mudar dps
module.exports = {
  // Execução do comando
  run: (client, botUtils, message, result, imageExists, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      let img = message.attachments.first()
      result.colors = '';
      let ended = '';
      //não tá não
      //eu to usando no image exists e to salvando ela no config.json

      botUtils.jsonChange('./dataBank/config.json', conf => {
        conf.players[message.member.id] = conf.players[message.member.id] || {};
      }, true);

      const config = args.length ? args.shift() : 'help';
      switch (config) {
        case 'background':
          let imagem = args[0];

          if (imagem && !imageExists(imagem) && !img) return message.channel.send("img invalida");

          result.background = args[0] || (img && img.url) || null;

          if (!result.background) message.reply("seu fundo foi restaurado");
          botUtils.jsonChange('./dataBank/config.json', conf => {
            conf.players[message.member.id].background = result.background;
            return conf;
          }, true);
          break;

        case 'color':
          
          let cor = '';
          args.forEach((name, index) => {
            name = name.toLowerCase();

            let result = /(\d{1,3})+%([dl])/i.exec(name)


            if (result && parseInt(result[1]) <= 100){
              
              cor += result[0]

            } else if (botUtils.hexToRgb(name)) {
              cor += name
            } else {
              ended = "Não foi possivel entender a configuração de cores que você deseja."
            }
            cor += ' '
          });

          if (ended) return message.reply(ended);

          botUtils.jsonChange('./dataBank/config.json', conf => {
            conf.players[message.member.id].colors = cor;
            return conf;
          }, true);

          break;
        default:
          return message.reply('configuração desconhecida')
        case 'help':
        case 'ajuda':
          let embed = new Discord.MessageEmbed()
            .setTitle("Config Ajuda")
            .setDescription("**ma config background [imagem/link da imagem]**: para definir o plano de fundo, caso deseja remover envie somente `ma config background`\n**ma config color <cor>**:envia cores temas pro seu perfil, pode tbm adicionar mais de uma cor, e se deseja uma cor aleatoria escreva `random`");
          return message.channel.send(embed);

      }
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
    name: "config",
    aliases: ["cf"],
    description: "configurações?",
    usage: "config",
    accessableby: "Membros"
  }
}