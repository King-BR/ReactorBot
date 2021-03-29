const Discord = require('discord.js');
const Canvas = require('canvas');
const imageExists = require('is-image-url');
const botUtils = require("../../utils.js");

module.exports = {
  run: async (client, message, args) => {
    newError = botUtils.newError;

    try {
      //Criando constantes

      const messages = botUtils.jsonPull('./dataBank/mesTotal.json').messages;
      const guild = client.guilds.cache.get('699823229354639471')
      const member = guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;

      // resultado pra printar
      let result = {
        name: 'global',
        image: 'sla',
        background: null,
        msgs: [],
        msgBig: 0,
        msgTotal: 0,
        colors: "random 50%d",
        type: "barra"
      };
      //command

      let command = args.shift();
      switch (command) {
        case 'global': {
          for (let period of messages) {
            result.name = 'Global';
            result.image = message.guild.iconURL({ format: 'jpg' });

            let numb = 0;
            Object.values(period).forEach(val => {
              numb += val;
            });
            //numb /= Object.values(period).length;
            numb = isNaN(numb) ? 0 : numb;
            numb = Math.round(numb);

            result.msgBig = Math.max(result.msgBig, numb);
            result.msgTotal += numb;
            result.msgs.unshift(numb || 0);
          }
          break;
        }
        case 'cf':
        case 'config': {

          const c = client.utils.Info.config.run(client, message, result, imageExists, args);
          console.log(c)
          if (c) return c;
        }

        default: {
          const conf = botUtils.jsonPull('./dataBank/config.json').players[member.id];

          if (conf) {
            result.colors = conf.colors || result.colors;
            result.background = conf.background || result.background;
            result.type = conf.type || result.type;
          }
          result.name = member.displayName;
          result.image = member.user.displayAvatarURL({ format: 'jpg' });
          for (let period of messages) {
            result.msgBig = Math.max(result.msgBig, period[member.id] || 0);
            result.msgTotal += period[member.id] || 0;
            result.msgs.unshift(period[member.id] || 0);
          }
        }
      }

      if([command, args[0]].includes("return")) return message.channel.send(`\`${result.msgs.join(" ")}\`\nsize: ${result.msgs.length}`)
      if(result.msgs.length != 24) return message.reply(`Ocorreu um erro, esta armazenado ${result.msgs.length} periodos, contate um adm`);

      //aqui entra uma linha "#FFFFFF #000000"
      let colorsRaw = result.colors.trim().split(" ")
      result.colors = []

      colorsRaw.forEach((ele, index) => {

        const resp = /(\d{1,3})%([dl])/g.exec(ele)

        if (resp) {
          const q = parseInt(resp[1]) / 100
          let ant = result.colors[index - 1]

          if (resp[2].indexOf('d') > -1) ant = [ant[0] * q, ant[1] * q, ant[2] * q];
          if (resp[2].indexOf('l') > -1) ant = [255 - (255 - ant[0]) * q, 255 - (255 - ant[1]) * q, 2(255 - ant[2]) * q];

          result.colors.push(ant)
        } else {
          result.colors.push(botUtils.hexToRgb(ele))
        }
      });
      //aqui sai [[255,255,255],[0,0,0]]
      
      //Making image
      switch (result.type) {
        default:
        case 'bezier':
        case 'linha':
        case 'barra':
          client.utils.Info.profImage.run(client, message, result);
          break;
        case 'ascii':
          let str = '';
          const graph = ['.', '_', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
          const cheight = Math.ceil(result.msgBig / 50)

          str += `**${result.msgTotal}** msgs\n`;

          str += '```\n'

          for (let l = 0; l < cheight; l++) {
            result.msgs.forEach(count => {
              str += graph[Math.min(Math.max(Math.floor((count / 50 - cheight + l + 1) * graph.length), 0), graph.length - 1)]
            })
            str += '\n'
          }
          str += '```'

          let embed = new Discord.MessageEmbed()
            .setTitle(result.name)
            .setDescription(str)
          message.channel.send(embed);

          break;
      }
    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle('Erro inesperado')
        .setDescription(
          'Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro'
        );
      message.channel.send(embed);

      let IDs = {
        server: message.guild.id,
        user: message.author.id,
        msg: message.id
      };
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: 'myactivity',
    noalias: 'Sem sinonimos',
    aliases: ['mystatus', 'ma'],
    description: 'Utilizado pra ver sua atividade no servidor',
    usage: 'myactivity',
    accessableby: 'Membros'
  }
};
