const Discord = require('discord.js');
const Canvas = require('canvas');
const imageExists = require('is-image-url');

module.exports = {
  // Execução do comandoant
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      //Criando constantes

      const messages = botUtils.jsonPull('./dataBank/mesTotal.json').messages;
      const member = message.mentions.members.first() || message.member;

      // resultado pra printar
      let result = {
        name: 'global',
        image: 'sla',
        background: null,
        msgs: [],
        msgBig: 0,
        msgTotal: 0,
        colors: "random 50%d"
      };
      //command

      let command = args.shift();
      switch (command) {
        case 'global':
          for (let period of messages) {
            result.name = 'Global';
            result.image = message.guild.iconURL({ format: 'jpg' });

            let numb = 0;
            Object.values(period).forEach(val => {
              numb += val;
            });
            numb /= Object.values(period).length;
            numb = isNaN(numb) ? 0 : numb;
            numb = Math.round(numb);

            result.msgBig = Math.max(result.msgBig, numb);
            result.msgTotal += numb;
            result.msgs.unshift(numb || 0);
          }
          break;
        case 'config':

          const c = client.utils.Info.config.run(client, botUtils, message, result, imageExists, args)
          if (c) return;

        default: 
          const conf = botUtils.jsonPull('./dataBank/config.json').players[member.id];

          if (conf) {
            result.colors = conf.colors;
            result.background = conf.background;
          }
          result.name = member.displayName;
          result.image = member.user.displayAvatarURL({ format: 'jpg' });
          for (let period of messages) {
            result.msgBig = Math.max(result.msgBig, period[member.id] || 0);
            result.msgTotal += period[member.id] || 0;
            result.msgs.unshift(period[member.id] || 0);
          }
      }

      for (let i = result.msgs.length; i <= 23; i++) {
        result.msg.unshift(0);
      }

      let colorsRaw = result.colors.trim().split(" ")
      result.colors = []
      
      colorsRaw.forEach((ele, index) => {

        const resp = /(\d{1,3})%([dl])/g.exec(ele)
        
        if (resp) {
          const q = parseInt(resp[1])/100
          let ant = result.colors[index-1]

          console.log(ant)
          if(resp[2].indexOf('d')) ant = [ant[0]*q,ant[1]*q,ant[2]*q];
          if(resp[2].indexOf('l')) ant = [255-(255-ant[0])*q,255-(255-ant[1])*q,255-(255-ant[2])*q];
          console.log(ant)
          result.colors.push(ant)
        } else {
          result.colors.push(botUtils.hexToRgb(ele))
        }
      });

      //if (resp[2].indexOf('d')) ant = ;
      //Nome
      //Final
      //Image

      //Making image

      client.utils.Info.profImage.run(client, botUtils, message, result)

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
