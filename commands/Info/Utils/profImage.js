const Discord = require("discord.js");
const Canvas = require("canvas");
const botUtils = require("../../../utils.js");

module.exports = {
  /**
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   * @param {{name: String,image: String,background: String|null,msgs: Number[],msgBig: Number,msgTotal: Number,colors: String,type: String}} result
   */
  run: async (client, message, result) => {
    newError = botUtils.newError;

    try {

      //error testing

      //color
      if (result.colors.some((el) => { return !el })) {
        console.log(`=> ${newError(new Error("A entrada de Cores esta errada"), 'profImage')}`)
      };

      //stating
      const canvas = Canvas.createCanvas(480, 300);
      const ctx = canvas.getContext('2d');

      const displayx = 40;
      const displayy = 90;
      const displayw = 420;
      const displayh = 190;
      const sizePL = 50*2**Math.max(Math.floor(Math.log2(result.msgBig/300)),0);

      const lasttime = Math.floor(new Date().getHours() / 3) * 3;
      const cheight = Math.max(Math.ceil(result.msgBig / sizePL), 1);
      const toColor = function(r, g, b) {
        let str;
        if (!isNaN(b)) {
          str = (
            Math.floor(r) * 2 ** 16 +
            Math.floor(g) * 256 +
            Math.floor(b)
          ).toString(16);
        } else if (!isNaN(r)) {
          r = Math.floor(r);
          str = Math.floor(r * 2 ** 16 + r * 256 + r).toString(16);
        } else if (Array.isArray(r)) {
          str = Math.floor(r[0] * 2 ** 16 + r[1] * 256 + r[2]).toString(16);
        } else {
          str = Math.floor(Math.random() * 16777215).toString(16);
        }

        str = '#' + str.padStart(6, '0');
        return str;
      };

      //background
      // result.img = image
      let bg = result.background
      if (bg) {
        
        const backg = await Promise.race([
          Canvas.loadImage(bg),
          botUtils.sleep(3000)
        ])

        if(!backg) return message.reply("Demorou muito para carregar seu background.");



        ctx.drawImage(backg, 0, 0, canvas.width, canvas.height);

      } else if (!bg) {
        ctx.fillStyle = "#444466";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      //lines
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff22';
      ctx.beginPath();
      ctx.font = '14px Roboto-Bold';
      for (let i = 0; i <= cheight; i++) {
        ctx.moveTo(displayx, displayy + (i * displayh) / cheight);
        ctx.lineTo(displayw + displayx, displayy + (i * displayh) / cheight);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(
          (cheight - i) * sizePL,
          displayx - ctx.measureText((cheight - i) * sizePL).width - 5,
          7 + displayy + (i * displayh) / cheight
        );
      }
      ctx.font = '8px Roboto-Bold';
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 25; i++) {
        ctx.moveTo(displayx + displayw * (i / 24), displayy);
        ctx.lineTo(displayx + displayw * (i / 24), displayy + displayh);
        const txt = ((lasttime - i * 3 + 72) % 24) + 'h';
        ctx.fillText(
          txt,
          displayx +
          (displayw / 24) * (24 - i) -
          ctx.measureText(txt).width / 2,
          displayy + displayh + 12
        );
      }
      ctx.stroke();

      //show
      if (result.type == "barra") {

        //bars
        ctx.strokeStyle = '#00000055';
        ctx.lineWidth = 3;
        result.msgs.forEach((val, index) => {
          //cons
          const x = displayx + (index * displayw) / 24;
          const y = displayy + (1 - val / cheight / sizePL) * displayh;
          const w = displayw / 24;
          const h = (val / cheight / sizePL) * displayh;

          const mn =
            result.colors[
            Math.floor((val / cheight / sizePL) * (result.colors.length - 1))
            ];
          const mx =
            result.colors[
            Math.ceil((val / cheight / sizePL) * (result.colors.length - 1))
            ];

          //set
          ctx.fillStyle = toColor(
            botUtils.limp(val / cheight / sizePL, mn[0], mx[0]),
            botUtils.limp(val / cheight / sizePL, mn[1], mx[1]),
            botUtils.limp(val / cheight / sizePL, mn[2], mx[2])
          );
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
        });
      } else if (result.type == 'linha' || result.type == 'linhacor') {
        //Linha
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = result.type.endsWith('cor') ? 2 : 3;
        ctx.beginPath();
        ctx.moveTo(displayx, displayy + displayh);
        ctx.lineTo(displayx, displayy + displayh * (1 - result.msgs[0] / cheight / sizePL));
        result.msgs.forEach((val, index) => {
          ctx.lineTo(displayx + (1 + 2 * index) * displayw / 48, displayy + displayh * (1 - val / cheight / sizePL));

        });
        ctx.lineTo(displayx + displayw, displayy + displayh * (1 - result.msgs[23] / cheight / sizePL));
        ctx.lineTo(displayx + displayw, displayy + displayh);
        ctx.closePath();
        ctx.stroke()
        if (result.type.endsWith('cor')) {
          ctx.fillStyle = botUtils.newGradient(ctx, 0, displayy + displayh, 0, displayy, botUtils.toColor(result.colors));
          ctx.fill();
        };
      } else if (result.type == 'bezier' || result.type == 'beziercor') {
        //Bezier
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2
        ctx.beginPath();
        ctx.moveTo(displayx, displayy + displayh);
        ctx.lineTo(displayx, displayy + displayh * (1 - result.msgs[0] / cheight / sizePL));
        result.msgs.forEach((val, index) => {

          if (index && index != 23) {

            ctx.bezierCurveTo(
              displayx + (2 * index) * displayw / 48,
              displayy + displayh * (1 - result.msgs[index - 1] / cheight / sizePL),

              displayx + (2 * index) * displayw / 48,
              displayy + displayh * (1 - val / cheight / sizePL),

              displayx + (1 + 2 * index) * displayw / 48,
              displayy + displayh * (1 - val / cheight / sizePL)
            );
          }

        });
        ctx.lineTo(displayx + displayw, displayy + displayh * (1 - result.msgs[23] / cheight / sizePL));
        ctx.lineTo(displayx + displayw, displayy + displayh);
        ctx.closePath();
        ctx.stroke();
        if (result.type.endsWith('cor')) {
          ctx.fillStyle = botUtils.newGradient(ctx, 0, displayy + displayh, 0, displayy, botUtils.toColor(result.colors));
          ctx.fill();
        };
      }

      //contorno dispplay
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(displayx, displayy, displayw, displayh);

      //user image
      ctx.strokeStyle = '#00000055';
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        displayx + displayw - displayy / 2 + 5,
        displayy / 2,
        displayy / 2 - 5,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.clip();

      const avatar = await Canvas.loadImage(result.image);
      ctx.drawImage(
        avatar,
        displayx + displayw - displayy + 10,
        5,
        displayy - 10,
        displayy - 10
      );
      ctx.restore();
      ctx.lineWidth = 8;
      ctx.stroke();

      //DisplayName
      ctx.lineWidth = 2;
      ctx.font = '30px Roboto-Bold';

      ctx.fillStyle = botUtils.newGradient(
        ctx,
        20,
        0,
        20 + ctx.measureText(result.name).width,
        0,
        botUtils.toColor(result.colors)
      );
      ctx.fillText(result.name, 20, 40);
      ctx.font = '30px Roboto-bold';
      ctx.strokeStyle = '#00000066';
      ctx.strokeText(result.name, 20, 40);

      //Msgs
      ctx.lineWidth = 2;
      ctx.font = '20px Roboto-Bold';
      let numb = 0;
      result.msgs.forEach(num => {
        numb += num;
      });
      ctx.fillStyle = botUtils.newGradient(
        ctx,
        20,
        0,
        20 + ctx.measureText(numb + ' msgs').width,
        0,
        botUtils.toColor(result.colors)
      );
      ctx.fillText(numb + ' msgs', 20, 70);
      ctx.font = '20px Roboto-bold';
      ctx.strokeStyle = '#00000066';
      ctx.strokeText(numb + ' msgs', 20, 70);

      //send
      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        `AtividadeDeUmGaykkkkkkkkk.png`
      );
      message.channel.send(attachment)
        .catch(err => console.log(`=> ${newError(err, module.exports.config.name, {server: message.guild.id,user:message.author.id,msg: message.id})}`));

    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle("Erro inesperado")
        .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
      message.channel.send(embed)

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
    name: "profImage",
    aliases: [],
    description: "descrição",
    usage: "uso",
    accessableby: "acessibilidade"
  }
}