const Discord = require("discord.js");
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, result, imageExists, args) => {
    newError = botUtils.newError;

    try {
      let img = message.attachments.first();
      let ended = '';
      let conf = botUtils.jsonPull('./dataBank/config.json');
      conf.players[message.member.id] = conf.players[message.member.id] || {};

      //detecta função
      const config = args.length ? args.shift() : 'help';
      switch (config) {
        //background
        case 'bg':
        case 'background': {
          
          let imagem = args[0];
          if (imagem && !imageExists(imagem) && !img) return message.channel.send("img invalida");
          result.background = args[0] || (img && imageExists(img.url) && img.url) || null;

          conf.players[message.member.id].background = result.background;
          break;
        }
        //Definir tipo
        case 'type': {
          if (!args[0]) return message.reply("cade o tipo caramba");

          let type = args[0].toLowerCase()

          if (!(type == 'ascii' || type == 'barra' || type == 'linha' || type == 'bezier' || type == 'linhacor' || type == 'beziercor')) return message.reply("tipo n reconhecido");

          conf.players[message.member.id].type = type
          break;
        }
        //Definir Cor
        case 'color': {
          let cor = '';
          args.forEach((name, index) => {
            name = name.toLowerCase();

            let result = /(\d{1,3})+%([dl])/i.exec(name)


            if (result && parseInt(result[1]) <= 100 && index) {

              cor += result[0]

            } else if (botUtils.hexToRgb(name)) {

              cor += name

            } else {ended = "Não foi possivel entender a configuração de cores que você deseja."}

            cor += ' '
          });

          if (ended) return message.reply(ended);

          conf.players[message.member.id].colors = cor;
          break;
        }
        default:
          message.reply('configuração desconhecida, olha novamente o ajuda, mas agr com atenção');
        case 'help':
        case 'ajuda': {
          let conf = botUtils.jsonPull('./dataBank/config.json');
          let player = conf.players[message.author.id]
          //let bg = player.background
          const embed = new Discord.MessageEmbed()
            .setTitle("Config Ajuda")
            .addField("ma config color <cor>", "Envia cores tema pro seu perfil. Também pode ser adicionado mais de uma cor. Se deseja uma cor aleatória use `random` com a cor.")
            .addField("ma config background <link/img>", "Use para definir o plano de fundo. Caso deseje remover seeu plano de fundo, use `config background`.")
            .addField("ma config type <type>", "Escolha o tipo de grafico q vai ser mostrado (`ascii`,`barra`,`linha`,`linhacor`,`bezier`,`beziercor`)");
            //.setImage(bg);
          return message.channel.send(embed);
        }

      }

      //adicionando no config.json
      botUtils.jsonPush('./dataBank/config.json', conf);


      // fim, começando erro
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