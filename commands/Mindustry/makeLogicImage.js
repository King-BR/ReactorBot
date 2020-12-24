const Discord = require("discord.js");
const Canvas = require("canvas");
const imageExists = require('is-image-url');
const zlib = require("zlib");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
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

      const toCol = (n) => "#" +
        Math.floor(n[0] * 255).toString(16).padStart(2, "0") +
        Math.floor(n[1] * 255).toString(16).padStart(2, "0") +
        Math.floor(n[2] * 255).toString(16).padStart(2, "0");

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
      const DRAWPERPRO = 8;
      let qpp = Math.floor((MAXLINE - DRAWPERPRO) / 2);
      let ptotal = Math.ceil(resultraw.length / qpp);

      //result para texto
      let result = [];
      let resultord = [];
      let lastcolor = [-1,-1,-1]
      resultraw.forEach((v, i) => {
        let c = [Math.round(v[0] * 255),Math.round(v[1] * 255),Math.round(v[2] * 255)]
        if(lastcolor.some((v,i) => v != c[i]) || resultord[resultord.length-1].length == MAXLINE-DRAWPERPRO) {
          lastcolor = c;
          resultord.push([`draw color ${Math.round(v[0] * 255)} ${Math.round(v[1] * 255)} ${Math.round(v[2] * 255)} 255 0 0`])  
        };
        resultord[resultord.length-1].push(`draw rect ${v[3]} ${canvas.height - v[4] - v[6]} ${v[5]} ${v[6]} 0 0`)
      });
      resultord = resultord.sort((a,b) => b.length - a.length)
      

      resultord.forEach((v) => {
        let ind = result.findIndex((q) => MAXLINE - DRAWPERPRO - q.length >= v.length)
        if(ind < 0) {
          result.push(v)
        } else {
          result[ind] = result[ind].concat(v)
        }
      })

      console.log(result.length)
      return message.reply("esta em manutenção");
      //colocrando comando de desenhar ${DRAWPERPRO}x para cada processador
      let tam = MAXLINE / DRAWPERPRO;
      result.forEach
      for (let i = tam; i <= result.length; i += tam) result.splice(i - 1, 0, "drawflush display1");
      if (result.slice(-1).pop() != "drawflush display1") result.push("drawflush display1");
      result = result.join('\n').split('\n');

      // FAZENDO SCHEMATIC
      let tags = { name: name, description: `Made by ${message.author.tag} using ReactorBot from MindustryBr discord server` };
      let res = [];
      let names = ["micro-processor", "large-logic-display", "message"];
      let addheight = Math.floor((result.length / MAXLINE + 1) / 6);

      let display = Buffer.alloc(7);
      let index = 0;
      index = display.writeInt8(1, index);
      index = display.writeInt16BE(2, index);
      index = display.writeInt16BE(3 + addheight, index);
      index = display.writeInt8(0, index);
      index = display.writeInt8(0, index);
      res.push(display);

      result.forEach((b,i) => {
        let string = result.join('\n');
        let code = Buffer.alloc(23 + string.length);
        let index = 0;
        index = code.writeInt8(1, index);
        index = code.writeInt32BE(string.length, index);
        index += code.write(string, index);
        index = code.writeInt32BE(1, index); // MUDA PRA 1
        index = code.writeInt16BE(8, index);
        index += code.write("display1", index);
        index = code.writeInt16BE(2 - (i / MAXLINE % 6), index); // LINK X
        index = code.writeInt16BE(3 + Math.floor(i / MAXLINE / 6), index); // LINK Y

        let config = zlib.deflateSync(code);
        let bconfig = Buffer.alloc(5);
        index = 0;
        index = bconfig.writeInt8(14, index);
        index = bconfig.writeInt32BE(config.length, index);
        config = new Buffer.concat([bconfig, config]);

        let block = Buffer.alloc(1 + 4);
        index = 0;
        index = block.writeInt8(0, index);
        index = block.writeInt16BE(i / MAXLINE % 6, index);
        index = block.writeInt16BE(addheight - Math.floor(i / MAXLINE / 6), index);
        block = new Buffer.concat([block, config])

        res.push(Buffer.from([...block].concat([0])))
      })
      for (let i = 0; i < result.length; i += MAXLINE) {
      }
      let string = `Made by [RED]${message.author.tag}[] using [PURPLE]Reactor[][gray]Bot[] from MindustryBr`;
      let config = Buffer.alloc(4 + Buffer.byteLength(string));
      index = 0;
      index = config.writeInt8(4, index);
      index = config.writeInt8(1, index);
      index = config.writeInt16BE(Buffer.byteLength(string), index);
      index += config.write(string, index);

      let block = Buffer.alloc(5);
      index = 0;
      index = block.writeInt8(2, index);
      index = block.writeInt16BE(Math.floor(1 + result.length / MAXLINE) % 6, index);
      index = block.writeInt16BE(addheight - Math.floor((result.length / MAXLINE + 1) / 6), index);
      block = new Buffer.concat([block, config])

      res.push(Buffer.from([...block].concat([0])))

      let ic = Buffer.alloc(2 + 2 + 1 + Object.keys(tags).length * 4 + Object.entries(tags).map(v => Buffer.byteLength(v[0]) + Buffer.byteLength(v[1])).reduce((a, b) => a + b, 0) + 1 + names.length * 2 + names.map(v => Buffer.byteLength(v)).reduce((a, b) => a + b, 0) + 4)
      index = 0;

      index = ic.writeInt16BE(6, index);
      index = ic.writeInt16BE(7 + addheight, index);
      index = ic.writeInt8(Object.keys(tags).length, index);
      Object.entries(tags).forEach(opt => {
        index = ic.writeInt16BE(Buffer.byteLength(opt[0]), index);
        index += ic.write(opt[0], index);
        index = ic.writeInt16BE(Buffer.byteLength(opt[1]), index);
        index += ic.write(opt[1], index);
      })
      index = ic.writeInt8(names.length, index);
      names.forEach(v => {
        index = ic.writeInt16BE(Buffer.byteLength(v), index);
        index += ic.write(v, index);
      })

      index = ic.writeInt32BE(res.length, index);

      res.unshift(ic)
      let bend = Buffer.from([109, 115, 99, 104, 1].concat([...zlib.deflateSync(new Buffer.concat(res))]))


      //let html = "<html>\t<head>\n\t\t<style></style>\n\t</head>\n\t<body>\n"+res.join("\n")+"\n\t</body>\n</html>"


      //console.log((new Date().getTime() - start) / 1000)
      let attach1 = new Discord.MessageAttachment(canvas.toBuffer(), "imagem.png");
      //let attach2 = new Discord.MessageAttachment(Buffer.from(res.join("\n\n")), "comand.html");
      /* let attach2 = new Discord.MessageAttachment(Buffer.from(bend), "comand.msch");
      let embed = new Discord.MessageEmbed()
        .setTitle(`o tamanho foi de ${canvas.width * canvas.height}px² para ${result.length}px²`)
        .attachFiles([attach1, attach2])
        .setImage("attachment://image.png") */

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