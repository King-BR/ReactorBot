const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {

      //Criando constantes
      const messages = botUtils.jsonPull('./dataBank/mesTotal.json').messages;
      let user = message.mentions.users.first() || message.author;
      const sizeperline = 10;

      let msg;
      let max = 1;
      let final = [];

      //Verifica se n possui erro na entrada
      if (!isNaN(parseInt(args[0]))) {
        user = client.users.cache.get(args[0])
        if (!user) return message.reply('Não foi possivel indentificar o usuario pelo id: ' + args[0]);
      };

      //Pega a variaveis
      if (args[0] == 'global') {

        msg = 'Essa é a media de palavras dos players ativos nas ultimas 72 horas:'
        for (let period of messages) {
          let numb = 0;
          Object.values(period).forEach(val => { numb += val; });
          numb /= Object.values(period).length;
          max = Math.max(max, numb);
          final.unshift(numb);
        }

      } else {

        msg = `Essa é a media de palavras de ${user.tag} nas ultimas 72 horas:`

        for (let period of messages) {
          max = Math.max(max, period[user.id] || 0);
          final.unshift(period[user.id] || 0);
        }
      }

      //lines = Math.ceil(lines/sizeperline);

      for (let i = final.length; i <= 23; i++) {
        final.unshift(0);
      }

      //Making image

      //cons
      const canvas = Canvas.createCanvas(480, 300);
      const ctx = canvas.getContext('2d');

      const displayx = 20;
      const displayy = 90;
      const displayw = 440;
      const displayh = 190;

      const cheight = Math.ceil(max/50);
      max = cheight*50;
      const toColor = function(r, g, b) {
        let str;

        if (!isNaN(b)) {
          str = (Math.floor(r) * 2**16 + Math.floor(g) * 256 + Math.floor(b)).toString(16)
        } else if (!isNaN(r)) {
          r = Math.floor(r)
          str = Math.floor(r * 2 ** 16 + r * 256 + r).toString(16)
        } else if (Array.isArray(r)) {
          str = Math.floor(r[0] * 2 ** 16 + r[1] * 256 + r[2]).toString(16)
        } else {
          str = Math.floor(Math.random() * 16777215).toString(16)
        }

        str = '#' + str.padStart(6, '0')
        return str
      }

      //background
      ctx.fillStyle = "#444466";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      //palavras

      //bars
      ctx.strokeStyle = "#00000055";
      ctx.lineWidth = 3;
      final.forEach((val, index) => {
        //cons
        const x = displayx + index * ( displayw ) / 24;
        const y = displayy + (1 - val / max) * displayh;
        const w = displayw / 24;
        const h = val / max * displayh;

        const cfrom = [255, 125, 0]
        const cto = [255, 0, 255]

        //set
        ctx.fillStyle = toColor(
          botUtils.limp(val / max, cfrom[0], cto[0]),
          botUtils.limp(val / max, cfrom[1], cto[1]),
          botUtils.limp(val / max, cfrom[2], cto[2])
        );
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      });
      ctx.lineWidth = 1;

      //lines
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(displayx, displayy, displayw, displayh);
      ctx.strokeStyle = "#ffffff22";
      ctx.beginPath()
      for (let i = 0; i <= cheight; i++) {
        ctx.moveTo(displayx, displayy + i * displayh / cheight);
        ctx.lineTo(displayw + displayx, displayy + i * displayh / cheight);
      }
      ctx.stroke();

      //eafdad
      ctx.font = "20px Roboto";
      ctx.fillText('eae', 10, 50);

      //send
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
      message.channel.send(attachment);


      /*
      const asc = ['.','_','▁','▂','▃','▄','▅','▆','▇','█']
      let str = ''

      for(let l = 0;l < lines;l++){
        final.forEach(tam => {
          const numb = Math.round( Math.max(Math.min(1,tam/sizeperline-lines+l+1)*(asc.length-1),0))
          str += tam > 0 && tam < 6 && l == lines ? ',' :asc[numb]; 
        });
        str += '\n';
      }
      msg += `\n${final}\n\`\`\`\n${str}\n\`\`\``
      message.reply(`${msg}:\n${final}\n\`\`\`\n${str}\n\`\`\``);
      */
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
    name: "myactivity",
    noalias: "Sem sinonimos",
    aliases: ['mystatus', 'ma'],
    description: "Utilizado pra ver sua atividade no servidor",
    usage: "myactivity",
    accessableby: "Membros"
  }
}