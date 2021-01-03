const Discord = require("discord.js");
const Canvas = require("canvas");
const imageExists = require('is-image-url');
const zlib = require("zlib");
const botUtils = require("../../utils.js");

module.exports = {
  run: async (client, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      let start = new Date().getTime();
      let imagem = message.attachments.size ? message.attachments.first().url || null : args.pop();
      if (!imageExists(imagem)) return message.reply("img invalida");

      let rq = 128 / 255
      let quality = args.pop() || 80;
      let name = args.join(" ") || "Image in Logic";

      if (isNaN(quality)) return message.reply("o nivel de qualidade precisa ser um numero");
      if (parseFloat(quality) < 0 || parseFloat(quality) > 100) return message.reply("o nivel de qualidade precisa ser entre 0% e 100%");
      quality = 1 - (parseFloat(quality) / 100) ** (0.2)

      const backg = await new Canvas.loadImage(imagem);
      let big = Math.max(backg.width, backg.height)
      let canvas = Canvas.createCanvas(180, 180);
      let ctx = canvas.getContext("2d");
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(backg, 0, 0, canvas.width * backg.width / big, canvas.height * backg.height / big);

      let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let resultraw = []; //[r,g,b,x,y,w,h]

      const toCol = (n) => {
        return "#" +
          Math.floor(n[0] * 255).toString(16).padStart(2, "0") +
          Math.floor(n[1] * 255).toString(16).padStart(2, "0") +
          Math.floor(n[2] * 255).toString(16).padStart(2, "0");
      }
      const quad = (x, y, w, h, q) => {
        let b = [null, null, null, null, null];

        //Caso seja um pixel, retorna o pixel
        if (w == 1 && h == 1) {
          let pos = (x + y * canvas.width) * 4
          return [data.data[pos] / 255, data.data[pos + 1] / 255, data.data[pos + 2] / 255]
        }

        //Caso seja maior q 1 pixel, retorna uma quadtree de pixels
        let mnw = Math.floor(w / 2)
        let mxw = Math.ceil(w / 2)
        let mnh = Math.floor(h / 2)
        let mxh = Math.ceil(h / 2)

        b[0] = null;

        if (h > 1 && w > 1) b[1] = quad(x, y, mnw, mnh, q);
        if (h > 1) b[2] = quad(x + mnw, y, mxw, mnh, q);
        if (w > 1) b[3] = quad(x, y + mnh, mnw, mxh, q);
        b[4] = quad(x + mnw, y + mnh, mxw, mxh, q);

        //caso sejam iguais, retorne um pixel com a nova cor
        let c = [0, 0, 0]
        let l = b.filter((v, i) => i && v).length;

        for (let i = 0; i < c.length; i++) {
          for (let j = 1; j < 5; j++) {
            c[i] += b[j] && (isNaN(b[j][i]) ? b[j][0][i] : b[j][i]) || 0;
          }
          c[i] /= l;
        }
        if (!b.filter((v, i) => i && v).some((v) => {
          return isNaN(v[0]) || c.some((c, i) => q - Math.abs(c - v[i]) < 0)
        })) return c;
        b[0] = c

        return b;
      }
      const openquad = (q, x, y, w, h, f) => {
        if (!q) return;
        if (isNaN(q[0])) {
          let mnw = Math.floor(w / 2)
          let mxw = Math.ceil(w / 2)
          let mnh = Math.floor(h / 2)
          let mxh = Math.ceil(h / 2)


          if (q[1]) openquad(q[1], x, y, mnw, mnh)
          if (q[2]) openquad(q[2], x + mnw, y, mxw, mnh)
          if (q[3]) openquad(q[3], x, y + mnh, mnw, mxh)
          if (q[4]) openquad(q[4], x + mnw, y + mnh, mxw, mxh)
        } else {
          resultraw.push([Math.round(q[0] * 255 * rq) / 255 / rq, Math.round(q[1] * 255 * rq) / 255 / rq, Math.round(q[2] * 255 * rq) / 255 / rq, x, y, w, h])
        }
      }

      let qd = quad(0, 0, canvas.width, canvas.height, quality)
      openquad(qd, 0, 0, canvas.width, canvas.height)
      resultraw.forEach((v, i) => {
        ctx.fillStyle = toCol(v);
        ctx.fillRect(v[3], v[4], v[5], v[6])
      });

      resultraw.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])

      // --- CRIANDO SCHEMATICA --- //

      //variaveis
      const MAXLINE = 1000;
      const DRAWPERPRO = 5;
      let qpp = Math.floor((MAXLINE - DRAWPERPRO) / 2);
      let ptotal = Math.ceil(resultraw.length / qpp);

      //result para texto
      let result = [];
      let resultord = [];
      let lastcolor = [-1, -1, -1]

      //resultraw == todos os pixels

      resultraw.forEach((v, i) => {
        let color = [Math.round(v[0] * 255), Math.round(v[1] * 255), Math.round(v[2] * 255)];
        let last = resultord[resultord.length - 1];

        if (lastcolor.some((v, i) => v != color[i]) || last.length == MAXLINE - DRAWPERPRO - 3) {
          lastcolor = color;
          resultord.push([
            `draw color ${Math.round(v[0] * 255)} ${Math.round(v[1] * 255)} ${Math.round(v[2] * 255)} 255 0 0`,
            `draw rect ${v[3]} ${canvas.height - v[4] - v[6]} ${v[5]} ${v[6]} 0 0`
            ])
        } else {
          last.push(`draw rect ${v[3]} ${canvas.height - v[4] - v[6]} ${v[5]} ${v[6]} 0 0`)
        }
      });
      resultord = resultord.sort((a, b) => b.length - a.length)

      //resultord == todos os pixels separados por cor (para n ter q utilizar o comando color mais de uma vez)

      let mi = 0;
      resultord.forEach((v) => {
        let ind = result.findIndex((q) => MAXLINE - DRAWPERPRO - q.length - 4 >= v.length)
        if (v.length > 2) mi = Math.max(mi, ind + 1);
        if (ind < 0) {
          result.push(v)
        } else {
          result[ind] = result[ind].concat(v)
        }
      })
      result = result.reverse()

      //result == todos os pixels separados por processador

      result = result.map((v, i) => {
        if (i <= result.length - mi - 1) {
          let l = Math.ceil(v.length / MAXLINE * DRAWPERPRO)-1
          v.push(`read r cell1 0`)
          v.push(`jump ${v.length - 1 + l} notEqual r ${i}`)
          v.push(`write ${i + 1}`)
          v.push(`jump ${v.length - 3 + l} always r false`)
          console.log(v)
        } else {
          v.unshift("jump 0 notEqual r " + (i <= result.length - mi - 1 ? 0 : i));
          v.unshift(`read r cell1 0`);
          v.push(`write ${i + 1}`)
        }
        return v;
      })

      //colocrando comando de desenhar ${DRAWPERPRO}x para cada processador
      let tam = MAXLINE / DRAWPERPRO;
      result.map((b) => {
        for (let i = 1; i < DRAWPERPRO; i++) {
          if (i * MAXLINE / DRAWPERPRO >= b.length) break;
          b.splice(i * MAXLINE / DRAWPERPRO, 0, "drawflush display1")
        }
        b.splice(b.length - 1, 0, "drawflush display1")
      })

      // FAZENDO SCHEMATIC
      let addheight = Math.floor((result.length + 1) / 6);

      let schem = {
        width: 6,
        height: 7 + addheight,
        tags: {
          name: name,
          description: `Made by ${message.author.tag} using ReactorBot from MindustryBr discord server`
        },
        names: ["micro-processor", "large-logic-display", "message", "memory-cell"],
        blocks: [
          {
            type: 1,
            position: [2, 3 + addheight],
          },
          {
            type: 2,
            position: [
              Math.floor(result.length + 1) % 6,
              addheight - Math.floor((result.length + 1) / 6)
            ],
            configt: 4,
            config: `Made by [RED]${message.author.tag}[] using [PURPLE]Reactor[][gray]Bot[] from MindustryBr https://discord.gg/G5zvFHN`,
          },
          {
            type: 3,
            position: [0, addheight],
          }
        ]
      }

      result.forEach((b, i) => {
        let string = b.join('\n');
        let code = Buffer.alloc(23 + string.length + 2 + 5 + 4);
        let index = 0;
        index = code.writeInt8(1, index); // VERSION
        index = code.writeInt32BE(string.length, index); // CODE SIZE
        index += code.write(string, index); // CODE
        index = code.writeInt32BE(2, index); // LINKS

        index = code.writeInt16BE(8, index); // LINK NAME SIZE
        index += code.write("display1", index); // LINK NAME
        index = code.writeInt16BE(1 - ((i + 1) % 6), index); // LINK X
        index = code.writeInt16BE(3 + Math.floor((i + 1) / 6), index); // LINK Y

        index = code.writeInt16BE(5, index); // LINK NAME SIZE
        index += code.write("cell1", index); // LINK NAME
        index = code.writeInt16BE(-((i + 1) % 6), index); // LINK X
        index = code.writeInt16BE(Math.floor((i + 1) / 6), index); // LINK Y

        //Config tipo + tamanho
        let config = zlib.deflateSync(code);
        let bconfig = Buffer.alloc(5);
        bconfig.writeInt8();
        bconfig.writeInt32BE(config.length);
        //config = new Buffer.concat([bconfig, config]);

        //Criando bloco
        let block = {
          type: 0,
          position: [
            (1 + i) % 6,
            addheight - Math.floor((i + 1) / 6)
          ],
          configt: 14,
          config: config
        }

        console.log(block)

        schem.blocks.push(block)
      })

      // ENVIANDO

      bend = botUtils.mndJsonToScheme(schem);
      let attach1 = new Discord.MessageAttachment(canvas.toBuffer(), "imagem.png");
      let s = botUtils.mndGetScheme(bend.toString("base64"))
      botUtils.mndSendMessageEmbed(bend.toString("base64"), s, message)

      message.channel.send(attach1);



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
    name: "logicimage",
    aliases: ['li'],
    description: "Transforma base64 em esquemas do mindustry",
    usage: "logicimage <quality> <img>",
    accessableby: "Membros"
  }
}