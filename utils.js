// NPM requires
const chalk = require("chalk");
const fs = require("fs");
const format = require("date-fns/format");
const zlib = require("zlib");
const bb = require("bit-buffer");
const Canvas = require('canvas');
const Discord = require('discord.js');

// Files requires
const config = require("./config.json");


//--------------------------------------------------------------------------------------------------//
// Error handler private utils
/**
 * @param [fileName="null"] {String} Arquivo onde ocorreu o erro
 * @param [IDs] {Object} IDs involvidos
 * @param [IDs.server=null] {String|Number} ID do server
 * @param [IDs.user=null] {String,Number} ID do usuario
 * @param [IDs.msg=null] {String|Number} ID da mensagem
 */
function generateErrorID(fileName = "null", IDs = { server: null, user: null, msg: null }) {
  if (IDs.server == null) IDs.server = 1;
  if (IDs.user == null) IDs.user = 1;
  if (IDs.msg == null) IDs.msg = 1;

  let errorID = `${Math.round(Math.random() * 10000) * IDs.server * IDs.user * IDs.msg * new Date().getTime()}`
  errorID = errorID.slice(2, 15);

  //console.log(errorID);
  return errorID;
}

//--------------------------------------------------------------------------------------------------//
// Exports
module.exports = {

  //--------------------------------------------------------------------------------------------------//
  // Chalk config

  chalkClient: {
    chalk: chalk,
    error: chalk.bold.red,
    warn: chalk.bold.keyword('orange'),
    ok: chalk.bold.green
  },

  //--------------------------------------------------------------------------------------------------//
  // Mix utils

  /**
   * Checa se o usuario do ID fornecido faz parte do time de desenvolvedores
   * @param ID {String|Number} ID do usuario para checar
   * @returns {Boolean}
   */
  isDev: (ID) => {
    if (config.devsID.includes(ID)) return true;
    return false;
  },

  /**
   * Formata datas no estilo dd/MM/yyyy HH:mm:SS
   * @param date {Date} Data para formatar
   * @returns {String} Data formatada no estilo dd/MM/yyyy HH:mm:SS
   */
  formatDate: (date) => {
    return format(date - 10800000, "dd/MM/yyyy HH:mm:ss");
  },

  /**
   * Timer
   * @param ms {Number} Quantidade de tempo em milisegundos
   */
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  //--------------------------------------------------------------------------------------------------//
  // Handler utils

  /**
   * Checa se o caminho fornecido é uma pasta/diretorio
   * @param {String} path Caminho para o diretorio a ser checado
   * @returns {Boolean}
   */
  isDir: (path) => {
    try {
      var stat = fs.lstatSync(path);
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  },

  //--------------------------------------------------------------------------------------------------//
  // Error handler utils

  /**
   * Cria o log de um novo erro
   * @param err {Error} Erro que aconteceu
   * @param [fileName=null] {String} Nome do arquivo onde que aconteceu o erro
   * @param [IDs=null] {Object} IDs relacionados ao erro
   * @param [IDs.server=null] {String|Number} ID do server
   * @param [IDs.user=null] {String|Number} ID do usuario
   * @param [IDs.msg=null] {String|Number} ID da mensagem
   * @returns {String} String para logar no console
   */
  newError: (err, fileName = "null", IDs = { server: null, user: null, msg: null }) => {
    if (!err) return;
    let folder = fs.existsSync('./errors');
    fileName = fileName.split('.')[0];
    let errorFileName = `${fileName ? fileName + "_" : ""}${format(new Date() - 10800000, "dd:MM:yyyy_HH:mm:ss")}.json`;
    let dados = {
      errorID: generateErrorID(fileName, IDs),
      msdate: Number(new Date() - 10800000),
      date: module.exports.formatDate(new Date()),
      msg: err.message || null,
      stack: err.stack || null,
      IDs: IDs || null,
      thisfile: errorFileName
    };
    if (!folder) {
      fs.mkdirSync('./errors');
    }
    fs.writeFileSync(`./errors/${errorFileName}`, JSON.stringify(dados, null, 2), { encoding: 'utf8' });
    return `${chalkClient.error('Erro detectado!')}\nVeja o log em: ./errors/${errorFileName}`;
  },

  /**
   * Lista todos os erros
   * @returns {Array} Array com os arquivos dos erros
   */
  listErrors: () => {
    if (!fs.existsSync("./errors")) return [];
    return fs.readdirSync("./errors");
  },

  /**
   * Procura um erro usando o ID
   * @param errorID {String|Number} ID do erro
   * @returns {Object}
   */
  searchErrorByID: (errorID) => {
    let errorFolder = module.exports.listErrors();
    let errorSearched = errorFolder.filter(errorFile => {
      let errorData = require(`./errors/${errorFile}`);
      return errorData.errorID == errorID;
    });
    if (errorSearched.length > 0) {
      errorSearched = errorSearched[0];
    } else {
      errorSearched = null;
    }
    return errorSearched;
  },

  /**
   * Limpa todos os erros
   */
  clearAllErrors: () => {
    let errorFolder = module.exports.listErrors();
    errorFolder.forEach(errorFile => {
      fs.unlink(`./errors/${errorFile}`, (err) => { if (err) console.log("=> " + newError(err, errorFile)); });
    });
    return;
  },

  /**
   * Deleta um unico arquivo da pasta "errors"
   * @param file {String} Arquivo para excluir
   */
  deleteError: (file) => {
    let path = `./errors/${file}`;
    if (!file || !fs.existsSync(path)) throw new Error('Arquivo invalido!');
    fs.unlink(path, (err) => { if (err) console.log("\n=> " + newError(err, file)); });
    return;
  },

  //--------------------------------------------------------------------------------------------------//
  // Canvas utils

  /**
   * @param red {Number}
   * @param green {Number}
   * @param blue {Number}
   * @param alpha {Number}
   * @returns {string}
   */
  toColor: (red, green, blue, alpha) => {
    let str;

    if (Array.isArray(red) && !isNaN(red[0])) {
      green = parseInt(red[1])
      blue = parseInt(red[2])
      alpha = parseInt(red[3])
      red = parseInt(red[0])
    }

    if (!isNaN(red)) {
      str = '';
      //transforma os valores em numeros
      red = parseInt(red)
      green = parseInt(green)
      blue = parseInt(blue)
      alpha = parseInt(alpha)
      //arredonda os numeros pros campos legiveis
      if (!isNaN(red)) red = Math.min(Math.max(0, red), 255);
      if (!isNaN(green)) green = Math.min(Math.max(0, green), 255);
      if (!isNaN(blue)) blue = Math.min(Math.max(0, blue), 255);
      if (!isNaN(alpha)) alpha = Math.min(Math.max(0, alpha), 255);

      // red,blue => escala de cinza e alpha
      if (isNaN(blue)) {
        str += red.toString(16).padStart(2, '0')
        str += red.toString(16).padStart(2, '0')
        str += red.toString(16).padStart(2, '0')
        if (!isNaN(green)) str += green.toString(16).padStart(2, '0');
      } else {
        str += red.toString(16).padStart(2, '0')
        str += green.toString(16).padStart(2, '0')
        str += blue.toString(16).padStart(2, '0')
        if (!isNaN(alpha)) str += alpha.toString(16).padStart(2, '0');
      }

      str = '#' + str.toUpperCase()

    } else if (Array.isArray(red)) {

      str = []

      for (let ar of red) {
        str.push(module.exports.toColor(ar))
      }

    } else {
      str = '#' + Math.floor(Math.random() * (2 ** 24 - 1)).toString(16).padStart(6, '0').toUpperCase();
    }

    return str
  },

  /**
   */
  newGradient: (ctx, x1, y1, x2, y2, arr) => {

    const er = (cont) => {
      console.log(`=> ${module.exports.newError(new Error(cont), "Utils_newGradient")}`)
    }
    if (!ctx && !isNaN(ctx)) return er('Canvas não foi detectado');
    if (isNaN(x1)) return er('A posição x1 precisa ser um numero');
    if (isNaN(y1)) return er('A posição y1 precisa ser um numero');
    if (isNaN(x2)) return er('A posição x2 precisa ser um numero');
    if (isNaN(y2)) return er('A posição y2 precisa ser um numero');
    if (!Array.isArray(arr)) return er('Não foi possivel ver uma array');
    if (arr.length == 0) return module.exports.toColor();
    if (arr.length == 1) return Array.isArray(arr[0]) ? arr[0][1] : arr[0];

    let grd = ctx.createLinearGradient(x1, y1, x2, y2);

    if (Array.isArray(arr[0])) {
      arr.forEach(op => { grd.addColorStop(op[0], op[1]); })
    } else {
      arr.forEach((str, index) => {
        grd.addColorStop(index / (arr.length - 1), str);
      })
    }

    return grd
  },

  hexToRgb: (str) => {


    if (typeof str == "string") {

      str = str.trim()

      str = str.split(" ")
      if (str.length == 1) str = str[0];

      if (Array.isArray(str)) {

        return module.exports.hexToRgb(str)

      } else if (str.toLowerCase() == 'random') {

        return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]

      } else {

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : null;

      }

    } else if (Array.isArray(str)) {

      let out = []

      str.forEach(string => {
        out.push(module.exports.hexToRgb(string))
      })

      return out

    } else {
      console.log(`=> ${module.exports.newError(new Error("Que poha de entrada que tu boto aqui?"), "Utils_hexToRgb")}`)
    }
  },

  //--------------------------------------------------------------------------------------------------//
  // Math utils

  /**
   * Transforma um numero entre 0 e 1 em outro entre o minimo e maximo informado
   * @param norm {Number} Um valor entre 0 e 1
   * @param min {Number} o valor minimo
   * @param max {Number} o valor maximo
   * @returns {Number}
   */
  limp: (norm, min, max) => {
    return (max - min) * norm + min
  },

  //--------------------------------------------------------------------------------------------------//
  // Json utils

  /**
   * transforma um objeto em um .json
   * @param path {String} Caminho para o json a ser criado/substituido
   * @param object {Any}
   */
  jsonPush: (path, object) => {
    var data = JSON.stringify(object, null, 2);
    fs.writeFileSync(path, data, (err) => {
      if (err) throw err;
    });
    return false;
  },

  /**
   * transforma um .json em um objeto
   * @param path {String} Caminho para o json a ser transformado
   * @returns {object} 
   */
  jsonPull: (path) => {
    if (!(typeof path == "string" && path.endsWith('.json') && fs.existsSync(path))) return null;
    var data = fs.readFileSync(path);
    return JSON.parse(data);
  },

  /**
   * Pega um .json e utiliza em uma função
   * @param path {String} Caminho para o json usado
   * @param func {function} função para utilizar o func
   * @param min  {number} numero de segurança, se o objeto retornado tiver um tamanho menor, vai dar erro
   * obs. Se voce for usar esse comando só pra editar/adicionar json,
   * e nunca vai remover algo dele coloca no lugar de min o booleano true.
   */
  jsonChange: async (path, func, min = 0) => {
    //console.log(path);
    let bal = module.exports.jsonPull(path);

    if (!bal) return console.log(`=> ${module.exports.newError(new Error('Não foi encontrado um json no caminho inserido'), "utils_jsonChange")}`);;

    const ret = func(bal);
    min = (typeof min == 'boolean' && min) ? Object.keys(bal).length : min;

    if (typeof ret === 'object' && ret !== null) {

      if (Object.keys(ret).length >= min) {

        await module.exports.jsonPush(path, ret);

      } else {
        console.log(`=> ${module.exports.newError(new Error(`O tamanho do objeto (${Object.keys(ret).length}) foi menor que o esperado (${min})`), "utils_jsonChange")}`);
      }
    };
  },

  //--------------------------------------------------------------------------------------------------//
  // Rewarding system utils

  userGive: (userID, money = 0, xp = 0, fileName = '???') => {
    //criando função de erro
    const newError = (desc, fileName, obj) => {
      console.log(`=> ${module.exports.newError(new Error(desc), fileName + "_userGive", obj)}`);
    }

    return newError("Esperando a verificação do king no meu codigo, pra ver se eu n fiz nenhuma merda :P", '???');

    //fazendo os ifs
    if (typeof fileName != "string") return newError("O nome do arquivo não é uma string", "???");
    if (isNaN(userID)) return newError("O id do usuario é um valor estranho", fileName);
    if (isNaN(money)) return newError("O dinheiro precisa ser um numero", fileName, { user: userID });
    if (isNaN(xp)) return newError("A experiencia precisa ser um numero", fileName, { user: userID });

    //programa
    Users.findById(message.author.id, (err, doc) => {
      //caso tenha erro seja mostrado
      if (err) {
        console.log(
          '\n=> ' +
          newError(err, fileName, { user: userID })
        );
        return;
      }

      //se não existe um usuario, ele vai ser criado
      if (!doc) {
        let newUser = new Users({
          _id: userID,
          money: money,
          levelSystem: {
            xp: xp,
            txp: xp
          }
        });
        newUser.save();
        return obj;
      }

      //adicionando dinheiro/xp
      doc.money += money;
      doc.levelSystem.xp += xp;
      doc.levelSystem.txp += txp;

      doc.save();
    });
  },

  //--------------------------------------------------------------------------------------------------//
  // Schematics utils

  /**
   * Transforma um Json em um base64 de schema
   */

  mndJsonToScheme: (schema) => {

    // Escreve os Tamanhos
      //Escreve a largura
      //Escreve a altura
    
    // Escreve as tags
      //Escreve a altura

    // Escreves os nomes
    
    // Escreves os blocos
      //Escreve o tipo
      //Escreve a posição
      //Escreve a config
      //Escreve a rotação
    

  },

  mndGetScheme: (binarySchem) => {
    const VERSION = 1;
    const DEBUG = true;

    const config = (bits) => {

      const type = bits.readInt8();

      switch (type) {
        case 0: return null;
        case 1: return bits.readInt32();
        case 2: return bits.readInt32() * 2 ** 32 + bits.readUint32();
        case 3:
          var buf = new ArrayBuffer(4);
          var view = new DataView(buf);
          bits.readArrayBuffer(4).forEach((b, i) => view.setint8(i, b));
          return view.getFloat32(0);
        case 4: return bits.readInt8() != 0 ? bits.readUTF8String(bits.readInt16()) : null;
        case 5:
          let content = module.exports.jsonPull('./dataBank/mindustryContent.json');
          return content[['item', null, null, null, 'liquid'][bits.readInt8()]][bits.readUint16()];
        case 6:
          let list = [];
          let length = bits.readUInt16();
          while (length-- > 0) { list.push(bits.readInt32()); }
          return list;
        case 7: return [bits.readInt32(), bits.readInt32()];
        case 8:
          let len = bits.readInt8();
          let out = [];
          while (len-- > 0) {
            out.push([bits.readInt16(), bits.readInt16()]);
          }
          return out;
        case 10: return bits.readInt8();
        case 11:
          var buf = new ArrayBuffer(8);
          var view = new DataView(buf);
          bits.readArrayBuffer(8).forEach((b, i) => view.setUint8(i, b));
          return view.getFloat64(0);
        case 14:
          let blen = bits.readInt32();
          let bytes = [];
          while (blen-- > 0) {
            bytes.push(bits.readUint8())
          }
          return bytes;
        case 15: return bits.readInt8(); //Centro de comando

        //Não Atribuidos
        case 9:
          bits.readInt8(); bits.readInt16();
          console.log("Foi utilizado uma configuração não atribuida (" + type + ")"); return type;
        case 12:
          bits.readInt32();
          console.log("Foi utilizado uma configuração não atribuida (" + type + ")"); return type;
        case 13:
          bits.readInt16();
          console.log("Foi utilizado uma configuração não atribuida (" + type + ")"); return type;

        default: throw new Error("Tipo desconhecido " + type);

      }
    }

    // --- Verifying --- //

    let text = [...Buffer.from(binarySchem, 'base64')];
    let result = {};
    let bits;

    try {
      let i = ['m', 's', 'c', 'h', "\01"].findIndex((v,i) => v.toString().charCodeAt() != text[i]);

      if (i >= 0) return Math.floor(i / 4);

      bits = new bb.BitStream(zlib.inflateSync(Buffer.from(binarySchem, 'base64').slice(5)));
      bits.bigEndian = true;
    } catch (e) {
      if (DEBUG) console.log(e);
      return 3;
    }
    // --- CRIAÇÃO --- //

    try {
      // pegar largura e altura da schematic
      result.width = bits.readInt16()
      result.height = bits.readInt16()

      //pegar tags
      result.tags = {}
      let size = bits.readInt8()
      while (size-- > 0) {
        result.tags[bits.readUTF8String(bits.readInt16())] = bits.readUTF8String(bits.readInt16())
      }

      //pegar nomes dos blocos
      result.names = [];
      size = bits.readInt8()
      while (size-- > 0) {
        result.names.push(bits.readUTF8String(bits.readInt16()));
      }

    } catch (e) {
      if (DEBUG) console.log(e);
      return 4;
    }

    //pegar os blocos
    result.blocks = [];
    try {
      size = bits.readInt32()
      while (size-- > 0) {
        let block = {}
        block.type = bits.readInt8()
        block.position = [bits.readInt16(), bits.readInt16()]
        block.config = config(bits)
        block.rotation = bits.readInt8()

        result.blocks.push(block)
      }
    } catch (e) {
      if (DEBUG) console.log(e);
      return 5;
    }

    return result
  },

  schemeToCanvas: async (schema) => {

    // Constantes
    const cons = {
      CONVEYOR: ["titanium-conveyor", "conveyor", "armored-conveyor", "conduit", "plated-conduit", "pulse-conduit"],
      ITEMSCONVEYOR: ["titanium-conveyor", "conveyor", "armored-conveyor"],
      LIQUIDSCONVEYOR: ["conduit", "plated-conduit", "pulse-conduit"],
      PLATEDCONVEYOR: ["plated-conduit", "armored-conveyor"],

      BRIDGE: ["bridge-conveyor", "phase-conveyor", "bridge-conduit", "phase-conduit"],
      ITEMSBRIDGE: ["bridge-conveyor", "phase-conveyor"],
      LIQUIDSBRIDGE: ["bridge-conduit", "phase-conduit"],

      ROTATE: ["plastanium-conveyor"],
    }

    // Pegando os canvas
    let canvas = Canvas.createCanvas(schema.width * 32, schema.height * 32);
    let canvasM = Canvas.createCanvas(schema.width * 32, schema.height * 32);
    let ctx = canvas.getContext("2d");
    let ctxM = canvasM.getContext("2d");

    // Pegando as imagens
    const content = JSON.parse(fs.readFileSync('./dataBank/mindustryBlocks.json'));
    const atlas = JSON.parse(fs.readFileSync('./images/blocks.atlas'));
    let image = await Canvas.loadImage("./images/blocks.png");

    //Criando a memoria
    schema.memory = []
    for (let x = 0; x < schema.width; x++) {
      schema.memory[x] = [];
      for (let y = 0; y < schema.height; y++) {
        schema.memory[x][y] = -1;
      }
    }

    schema.blocks.forEach((block, id) => {
      let a = atlas[schema.names[block.type]]
      let size = a ? a[0] : 1;

      for (let x = -Math.floor((size - 1) / 2); x <= Math.floor(size / 2); x++) {
        for (let y = -Math.floor((size - 1) / 2); y <= Math.floor(size / 2); y++) {
          x = Math.min(Math.max(block.position[0] + x,0),schema.width-1)
          y = Math.min(Math.max(block.position[1] + y,0),schema.height-1)
          schema.memory[x][y] = id;
        }
      }

    })

    //Funções
    const draw = (ctx, item, x, y, rot) => {
      if (!item) item = atlas["error"];

      let s = item[0] * 32;
      x = x * 32 + 32
      y = (schema.height - y) * 32 - 32

      let px = x - Math.floor(item[0] / 2 + 0.5) * 32 + 32 - s / 2 % 32;
      let py = y - Math.floor(item[0] / 2) * 32 + 32 - s / 2 % 32;

      ctx.save()
      ctx.translate(px, py);

      if (rot) {
        ctx.rotate((rot || 0) * Math.PI / 2);
      }

      ctx.drawImage(image, item[1] * 32, item[2] * 32, s, s, s / 2 % 32 - 32, s / 2 % 32 - 32, s, s);
      ctx.restore();
    }
    const getBlock = (x, y, name) => {
      if (x < 0 || y < 0 || x >= schema.width || y >= schema.height) return;
      let block = schema.blocks[schema.memory[x][y]]
      return name && block ? schema.names[block.type] : block
    };
    const bridgeEnd = (x, y) => {
      let block = getBlock(x, y);
      if (block.config[0] && block.config[1]) return true;
      if (!(block.config[0] || block.config[1])) return true;
      return false;
    };

    //Desenha blocos
    schema.blocks.forEach((obj, i) => {
      let objName = schema.names[obj.type];

      if (cons.CONVEYOR.includes(objName)) { //Conveyors

        let pos = obj.position;
        let rot = (4 - obj.rotation) % 4;
        let sides = [0, 0, 0, 0];
        let plated = cons.PLATEDCONVEYOR.includes(objName)
        let name = cons.ITEMSCONVEYOR.includes(objName) ? "items" : "liquids";

        for (let i = 0; i < 4; i++) {
          let x = pos[0] + (i - 1) % 2;
          let y = pos[1] + (2 - i) % 2;
          let block = getBlock(x, y, true);
          if (
            (!plated && content[name].includes(block)) ||
            (cons[`${name.toUpperCase()}CONVEYOR`].includes(block) && getBlock(x, y).rotation == (4 - i) % 4) ||
            (!plated && cons[`${name.toUpperCase()}BRIDGE`].includes(block) && bridgeEnd(x, y))
          ) {
            sides[(i + obj.rotation) % 4] = 1;
          }
        }

        let n = 0;
        if (sides[1]) {
          if (sides[0]) n = 6;
          if (!sides[0]) n = 1;
        }
        if (sides[3]) {
          if (sides[0]) n = 2;
          if (!sides[0]) n = 5;
        }
        if (sides[1] && sides[3]) {
          if (sides[0]) n = 3;
          if (!sides[0]) n = 4;
        }

        draw(ctx, atlas[`${objName}-${n}`], obj.position[0], obj.position[1], rot)

      } else if (["door", "door-large"].includes(objName)) { //Doors
        draw(ctx, atlas[objName + (obj.config > 0 ? '-open' : '')], obj.position[0], obj.position[1])
      } else { //Block itself

        //console.log(obj.config)
        draw(ctx, atlas[objName], obj.position[0], obj.position[1], cons.ROTATE.includes(objName) ? -obj.rotation : 0);
      }
    })

    //Overlay de cor
    schema.names.forEach((type, typeID) => {
      if (["unloader", "item-source", "sorter", "inverted-sorter", "liquid-source"].includes(type)) {

        let atlasBlock = atlas[type + "-center"] || atlas["color-center"]
        ctxM.globalCompositeOperation = "source-over";
        schema.blocks.filter(block => block.type == typeID && block.config).forEach((block) => {
          ctxM.fillStyle = block.config.color;
          ctxM.fillRect(block.position[0] * 32, (schema.height - block.position[1] - 1) * 32, 32, 32);

          ctxM.beginPath();
          ctxM.save()
          ctxM.rect(block.position[0] * 32, (schema.height - block.position[1] - 1) * 32, 32, 32);
          ctxM.clip();

          ctxM.globalCompositeOperation = "destination-in";
          draw(ctxM, atlasBlock, block.position[0], block.position[1])
          ctxM.restore()
        });

      }
    });
    ctx.drawImage(canvasM, 0, 0);

    //Deixa tudo transparente
    ctx.globalAlpha = 0.8;

    //Desenha pontes
    schema.names.forEach((type, typeID) => {
      if (cons.BRIDGE.includes(type)) {
        schema.blocks.filter(obj => obj.type == typeID)
          .filter(obj => !(obj.config[0] && obj.config[1]))
          .forEach((obj) => {
            let block = getBlock(obj.position[0] + obj.config[0], obj.position[1] + obj.config[1]);
            if (block && block.type == typeID) {

              let dir = 3 + (obj.config[0] ? Math.sign(obj.config[0]) : 1 + Math.sign(obj.config[1]))
              let dist = Math.abs(obj.config[0] + obj.config[1]);

              while (dist-- > 1) {
                draw(ctx, atlas[type + "-bridge"],
                  obj.position[0] + Math.sign(obj.config[0]) * dist,
                  obj.position[1] + Math.sign(obj.config[1]) * dist,
                  -dir);
              }

            }
          });
      }
    })

    return canvas.toBuffer()
  },

  mndSendMessageEmbed: async (base64, schema, message) => {

    if (!isNaN(schema)) throw new Error("Foi enviado um numero");

    let final = await module.exports.schemeToCanvas(schema);

    // Calculos

    const blocks = JSON.parse(fs.readFileSync('./dataBank/mindustryBlocks.json'));
    const atlas = JSON.parse(fs.readFileSync('./images/blocks.atlas'));

    schema.crafterSize = 0;

    schema.blocks.forEach(block => {
      let objName = schema.names[block.type]
      let objAtlas = atlas[objName]
      if (Object.keys(blocks.crafter).includes(objName) && objAtlas) {
        schema.crafterSize += objAtlas[0] ** 2;
      }

    });
    schema.crafterSize /= schema.width * schema.height || 1;

    //Envio

    const attachment1 = new Discord.MessageAttachment(final, 'bufferedfilename.png');
    const attachment2 = new Discord.MessageAttachment(Buffer.from(base64, "base64"), schema.tags.name + '.msch');

    let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(schema.tags.name)
      .setColor("#9c43d9")
      .setFooter(schema.tags.description || '')
      .attachFiles([attachment1, attachment2])
      .setImage('attachment://bufferedfilename.png');

    if (schema.crafterSize) embed.addField("Eficiência de espaço", Math.floor(schema.crafterSize * 10000) / 100 + "%");

    message.channel.send(embed).then(msg => msg.react('📪'));
  }

  //--------------------------------------------------------------------------------------------------//
  // Level system utils

  /**
   * Configuração do sistema de level
   * @param [XPconfig] {Object} Opções do sistema de level
   * @param [XPconfig.modPerLVL=1.2] {Number} Modificador da quantidade de XP por level
   * @param [XPconfig.maxLVL=50] {Number} Level maximo
   * @param [XPconfig.defaultXPnextLVL=500] {Number} Quantidade padrao para upar de level
   * @returns {void}
   *
  setupXPconfig: (XPconfig = { modPerLVL: 1.2, maxLVL: 50, defaultXPnextLVL: 500 }) => {
    if (!fs.existsSync("./dataBank")) fs.mkdirSync("./dataBank");
    if (!fs.existsSync("./dataBank/levelSystem.json")) fs.writeFileSync("./dataBank/levelSystem.json", "[]", { encoding: "utf8" });

    let XPdataArray = [];
    let txp = XPconfig.defaultXPnextLVL;
    let XPNextLevel = XPconfig.defaultXPnextLVL;

    for (let i = 1; i <= XPconfig.maxLVL; i++) {
      XPdataArray.push({
        lvl: i,
        txp: txp,
        XPNextLevel: XPNextLevel
      });

      XPNextLevel = Math.round(XPNextLevel * XPconfig.modPerLVL);
      txp += XPNextLevel;
    }

    //console.log(XPdataArray);

    if (JSON.stringify(module.exports.jsonPull("./dataBank/levelSystem.json")) == JSON.stringify(XPdataArray)) return;
    fs.writeFileSync("./dataBank/levelSystem.json", JSON.stringify(XPdataArray), { encoding: "utf8" });
    return;
  }
  */
}