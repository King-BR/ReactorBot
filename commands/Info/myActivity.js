const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {

      //Criando constantes
      const messages = botUtils.jsonPull('./dataBank/mesTotal.json').messages;
      let user = message.mentions.members.first() || message.member;
      const sizeperline = 10;

      let msg;
      let max = 1;
      let final = [];
      let cfrom = [125, 255,255];
      let cto = [255, 255, 255];
      
      //Verifica se n possui erro na entrada

      if (args.length == 6 && !args.some(val =>{
          return isNaN(parseInt(val)) || parseInt(val) < 0 || parseInt(val) > 255 
        })) {
        cfrom = [parseInt(args[0]),parseInt(args[1]),parseInt(args[2])]
        cto =   [parseInt(args[3]),parseInt(args[4]),parseInt(args[5])]
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

      const displayx = 40;
      const displayy = 90;
      const displayw = 420;
      const displayh = 190;

      const lasttime = Math.floor(((new Date()).getHours()-3)/3)*3;
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
      ctx.strokeStyle = "#555555";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      //lines
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff22";
      ctx.beginPath()
      ctx.font = "14px Roboto-Bold";
      for (let i = 0; i <= cheight; i++) {
        ctx.moveTo(displayx, displayy + i * displayh / cheight);
        ctx.lineTo(displayw + displayx, displayy + i * displayh / cheight);
        ctx.fillStyle = '#ffffff'
        ctx.fillText((cheight-i)*50,displayx-ctx.measureText((cheight-i)*50).width-5, 7+displayy+ i * displayh / cheight);
      }
      ctx.stroke();

      //bars
      ctx.strokeStyle = "#00000055";
      ctx.font = "8px Roboto-Bold";
      ctx.lineWidth = 3;
      final.forEach((val, index) => {
        //cons
        const x = displayx + index * ( displayw ) / 24;
        const y = displayy + (1 - val / max) * displayh;
        const w = displayw / 24;
        const h = val / max * displayh;

        //set
        ctx.fillStyle = toColor(
          botUtils.limp(val / max, cfrom[0], cto[0]),
          botUtils.limp(val / max, cfrom[1], cto[1]),
          botUtils.limp(val / max, cfrom[2], cto[2])
        );
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(
          (lasttime-index*3+72)%24+'h',
          displayx+displayw/24*(23-index) - ctx.measureText((lasttime-index*3)%24 +'h').width/2,
          displayy+displayh+12
        );
      });

      //contorno dispplay
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(displayx, displayy, displayw, displayh);

      //user image
      ctx.strokeStyle = "#00000055";
      ctx.save()
	    ctx.beginPath()
	    ctx.arc(displayx+displayw-(displayy)/2+5,(displayy)/2,(displayy)/2-5,0, Math.PI * 2, true);
	    ctx.closePath();
	    ctx.clip();
      const avatar = await Canvas.loadImage(user.user.displayAvatarURL({ format: 'jpg' }));
      ctx.drawImage(avatar, displayx+displayw - displayy +10,5,displayy-10, displayy-10);
      ctx.restore();
      ctx.lineWidth = 8;
      ctx.stroke();

      //Text
      ctx.lineWidth = 2;
      ctx.font = "30px Roboto-Bold";

      var grd = ctx.createLinearGradient(10, 0, ctx.measureText(user.displayName).width, 0);
      grd.addColorStop(0,toColor(cfrom));
      grd.addColorStop(1,toColor(cto));
      ctx.fillStyle = grd;
      ctx.fillText(user.displayName, 20, 40);
      ctx.font = "30px Roboto-bold";
      ctx.strokeStyle = '#00000066';
      ctx.strokeText(user.displayName, 20, 40);

      //Text
      ctx.lineWidth = 2;
      ctx.font = "20px Roboto-Bold";
      let numb = 0;
      final.forEach(num => {numb += num});
      var grd = ctx.createLinearGradient(10, 0, ctx.measureText(numb+' msgs').width, 0);
      grd.addColorStop(0,toColor(cfrom));
      grd.addColorStop(1,toColor(cto));
      ctx.fillStyle = grd;
      ctx.fillText(numb+' msgs', 20, 70);
      ctx.font = "20px Roboto-bold";
      ctx.strokeStyle = '#00000066';
      ctx.strokeText(numb+' msgs', 20, 70);

      //send
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'quem-leu-é-gay.png');
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