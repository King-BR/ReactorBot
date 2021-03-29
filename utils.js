// NPM requires
const chalk = require("chalk");
const fs = require("fs");
const format = require("date-fns/format");
const zlib = require("zlib");
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
  //#region Chalk config

  chalkClient: {
    chalk: chalk,
    error: chalk.bold.red,
    warn: chalk.bold.keyword('orange'),
    ok: chalk.bold.green
  },

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Mix utils

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

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Handler utils

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

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Error handler utils

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

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Math utils

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

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Json utils

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

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Rewarding system utils

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

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Schematics utils

  /**
   * 
   * @param {String} base64
   * @param {Discord.Message} message
   * @param {Schematic} schema
   * @param {Canvas.Canvas?} canvas
   */
  mndSendMessageEmbed: async (base64, message, schema, canvas) => {

    if (typeof base64 !== "string") throw new Error(`No parametro base64 enviado um "${typeof base64}" ao invez de string`);
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

    //enviado
    const attachment1 = new Discord.MessageAttachment(canvas || (await schema.toCanvas()).toBuffer(), 'bufferedfilename.png');
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
  },

  //#endregion
  //--------------------------------------------------------------------------------------------------//
  //#region Class

  StreamStructure: class StreamStructure {

    /**
     * Cria um nova instancia
     * @param arr {String[]} json
     */
    constructor() {
      Array.from(arguments).some(v => {
        if (typeof v != "string" && !Array.isArray(v))
          throw new Error(`Foi esperado uma string porem foi enviado um (${typeof v})`);
        if (typeof v == "string" && !(/^[a-z]+(?:\[[1-68]\])*$/i.test(v)))
          throw new Error(`Foi enviado um tipo inesperado (${v.toString()})`);
      });
      this.struct = Array.from(arguments);
      this.types = {};
    }

    /**
     * Transforma em buffer
     * 
     * @returns {Buffer}
     */
    toBuffer() {

      let size = 0;
      let gettingSize = true;
      const reg1 = /^([a-z]+)((?:\[[1-68]\])*)$/i;
      const reg2 = /^\[([1-68])\]((?:\[[1-68]\])*)$/i;

      /**
       * 
       * @param {String|Array} type 
       * @param {Array} val 
       * @param {*} func 
       */
      const getSize = (type, val, func) => {
          

        if (val === undefined) throw new Error(`O valor inserido do tipo "${type}" esta vazio`)
        if (Array.isArray(type)) {
          if (gettingSize) {
            size++;
          } else {
            index = bits.writeUInt8(val[0], index);
          }
          return type[val[0]].forEach((v, i) => getSize(v, val[i + 1], func));
        }

        let [, name, brack] = reg1.exec(type);
        

        if (brack) {

          if (!Array.isArray(val)) throw new Error(`Ò valor experado era uma Array mas foi recebido uma ${typeof val}`)
          let [, tam, others] = reg2.exec(brack);

          if (gettingSize) {
            size += parseInt(tam);
          } else {
            index = bits.writeIntBE(val.length, index, parseInt(tam));
          }

          val.forEach(v => getSize(name + others, v, func))
        } else if (this.types[name]) {
          if (!Array.isArray(val)) throw new Error(`Ò valor experado era uma Array mas foi recebido uma ${typeof val}`)

          this.types[name].forEach((v,i) => getSize(v, val[i], func));
        } else {
          func(type, val)
        }
      }

      this.struct.forEach((v, i) => {
        getSize(v, arguments[i], (type, val) => {
          switch (type) {
            case "byte": size += 1; break;
            case "Ubyte": size += 1; break;
            case "short": size += 2; break;
            case "int": size += 4; break;
            case "long": size += 8; break;

            case "string": size += 2 + Buffer.byteLength(val); break;
            case "buffer": size += val ? val.length : 0; break;

            default: throw new Error(`Tipo desconhecido (${type})`)
          }
        })
      });

      gettingSize = false;
      let bits = Buffer.alloc(size);
      let index = 0;

      this.struct.forEach((v, i) => {
        


        getSize(v, arguments[i], (type, val) => {
          switch (type) {
            case "byte": index = bits.writeInt8(val, index); break;
            case "Ubyte": index = bits.writeUInt8(val, index); break;
            case "short": index = bits.writeInt16BE(val, index); break;
            case "int": index = bits.writeInt32BE(val, index); break;
            case "long": index = bits.writeBigInt64BE(val, index); break;

            case "buffer": index += val ? val.copy(bits, index) : 0; break;
            case "string": {
              index = bits.writeInt16BE(Buffer.byteLength(val), index);
              index += bits.write(val, index);
              break;
            }
          }
        })

      });

      return bits;
    }

    /**
     * Transforma em buffer
     * @param {Buffer} data
     * @returns {Array}
     */
    fromBuffer(data) {

      const reg1 = /^([a-z]+)((?:\[[0-68]?\])*)$/i
      const reg2 = /^\[([0-68]?)\]((?:\[[0-68]?\])*)$/i

      let index = 0;

      const read = (type) => {

        if (Array.isArray(type)) {

          index++;
          let choice = data.readUInt8(index - 1);
          if (choice > type.length) throw new Error("Out of choice");
          return { type: choice, data: type[choice].map(v => read(v)) }

        } if (reg1.exec(type)[2]) {
          //let name,brack;
          let [, name, brack] = reg1.exec(type);
          let [, size, others] = reg2.exec(brack);

          index += parseInt(size);
          size = data.readIntBE(index - size, parseInt(size));
          return Array.from({ length: size }, () => read(name + others));
        } else {
          switch (type) {
            case "long":
              index += 8;
              return data.readBigInt64BE(index - 8);
            case "int":
              index += 4;
              return data.readInt32BE(index - 4);
            case "short":
              index += 2;
              return data.readInt16BE(index - 2);
            case "byte":
              index += 1;
              return data.readInt8(index - 1);
            case "double":
              index += 8;
              return data.readDoubleBE(index - 8);
            case "float":
              index += 4;
              return data.readFloatBE(index - 4);

            case "string":
              index += 2;
              let size = data.readInt16BE(index - 2);
              index += size;
              return data.toString("utf8", index - size, index);

            default:
              if (!this.types[type]) throw new Error("Não foi possivel entender o tipo " + type)
              return this.types[type].map(t => read(t))
          }
        }

      }

      return this.struct.map(v => read(v))
    }

    /**
     * Cria um novo tipo de variavel para ser salva
     * @param {string} nome - Nome do tipo a ser salvo 
     * @param {StreamStructure} tipo - A estrutura a ser salva no local 
     */
    setType(name, struct) {
      const reg = /^([a-z]+)(?:\[[0-68]?\])*$/i

      if (struct.struct.filter(v => typeof v == "string").map(v => reg.exec(v)[1]).includes(name))
        throw new Error("Foi detectado uma Call recursiva infinita");
      this.types[name] = struct.struct;
      return this;
    }
  },

  Schematic: class Schematic {

    /**
     * @typedef {Object} Block
     * @property {Number} type
     * @property {Number[]} position
     * @property {Number} configt
     * @property {*} config
     * @property {Number} rotation
     * @property {Number} size
     */

    /** @type {Number} */
    width = 1;
    /** @type {Number} */
    height = 1;
    /** @type {Object} */
    tags = {};
    /** @type {String[]} */
    names = [];
    /** @type {Block[]} */
    blocks = [];

    /**
     * 
     * @param {Buffer|JSON} schema 
     */
    constructor(schema) {

      if (!Buffer.isBuffer(schema) && typeof schema !== "object")
        throw new Error("O valor enviado precisa ser um Buffer ou Objeto")

      if (Buffer.isBuffer(schema)) {
        const VERSION = 1;

        if (schema.length < 6 || Array.from(schema.slice(0, 5)).some((v, i) => v != [109, 115, 99, 104, VERSION][i]))
          throw new Error("This is not an Schematic Buffer");

        const SStruct = module.exports.StreamStructure;
        const SArray = new SStruct("short", "short", "json[1]", "string[1]", "block[4]")
          .setType("json", new SStruct("string", "string"))
          .setType("block", new SStruct("byte", "short", "short", [
            [], //0 - Maioria dos blocos nos quais não possui informação guardada
            // ex: copper-wall
            ["int"], //1 
            ["long"], //2
            ["float"],//3
            [[[], ["string"]]], //4 - Utilizado para carregar informações de um unico texto
            // ex: message
            ["byte", "short"], //5 - Utilizado para guardar Materiais/Fluidos/Objetos do jogo
            // ex: item-source, ordenator, 
            ["int[2]"], //6
            ["int", "int"], //7 - Utilizado para carregar cordenadas
            // ex: bridge-conveyor, mass-driver
            ["pos[1]"], //8 - Utilizada para carregar multiplas coordenadas pequenas
            // ex: power-node
            ["byte", "short"],//9 
            ["byte"], //10 - Utiliado para guardar informações booleanas ou de baixa variedade
            // ex: door, large-door, switch
            ["double"], //11
            ["int"], //12
            ["short"], //13
            ["byte[4]"], //14 - Utilizado para guardar informações complexas
            // ex: processor
            ["byte"] //15 - ???
            // ex: command-center
          ], "byte"))
          .setType("pos", new SStruct("short", "short"))
          .fromBuffer(zlib.inflateSync(schema.slice(5)));

        schema = {
          width: SArray[0],
          height: SArray[1],
          tags: Object.fromEntries(SArray[2]),
          names: SArray[3],
          blocks: SArray[4].map(v => {
            return {
              type: v[0],
              position: [v[1], v[2]],
              configt: v[3].type,
              config: v[3].data,
              rotation: v[4]
            }
          })
        }
      }
      // Constantes

      const atlas = JSON.parse(fs.readFileSync('./images/blocks.atlas'));


      // Detectar entradas invalidas
      if (!schema) throw new Error("Is necessary the input")
      if (isNaN(schema.width) || parseInt(schema.width) < 1) throw new Error("Invalid width")
      if (isNaN(schema.height) || parseInt(schema.height) < 1) throw new Error("Invalid height")
      if (schema.names.some(v => typeof v != "string")) throw new Error("All names must to be String")
      if (Object.entries(schema.tags).some(v => typeof v[0] != "string" && typeof v[1] != "string"))
        throw new Error("All names must to be String")

      //armazenando

      this.width = Math.ceil(schema.width);
      this.height = Math.ceil(schema.height);
      this.tags = schema.tags || { name: "nameless" };
      this.names = schema.names || [];
      this.blocks = (schema.blocks || []).map((v,i) => {

        if (isNaN(v.type)) v.type = 0;
        if (!Array.isArray(v.position)) v.position = [i%this.width,this.height-1-Math.floor(i/this.width)];
        if (isNaN(v.configt)) v.configt = 0;
        if (!v.config) v.config = null;
        if (isNaN(v.rotation)) v.rotation = 0;

        switch (v.configt) {
          case 5: {

          }
        }

        let a = atlas[this.names[v.type]]
        v.size = a ? a[0] : 1;
        return v;
      })



      //Criando a memoria
      this.memory = []
      for (let x = 0; x < schema.width; x++) {
        this.memory[x] = [];
        for (let y = 0; y < schema.height; y++) {
          this.memory[x][y] = -1;
        }
      }
      this.blocks.forEach((block, id) => {
        let mn = -Math.floor((block.size - 1) / 2);
        let mx = Math.floor(block.size / 2);

        for (let x = mn; x <= mx; x++) {
          for (let y = mn; y <= mx; y++) {
            let lx = Math.min(Math.max(block.position[0] + x, 0), schema.width - 1)
            let ly = Math.min(Math.max(block.position[1] + y, 0), schema.height - 1)
            this.memory[lx][ly] = id;
          }
        }

      })

      //Transformando plastanium

      let type = this.names.indexOf("plastanium-conveyor");
      if (type >= 0) {
        let inID = -1;
        let outID = -1;

        const validOut = (b) => {
          if (b.type != type) return false

          let sf = this.lookingBlocks(b, b.rotation, true)
          let sr = this.lookingBlocks(b, b.rotation + 1)
          let sl = this.lookingBlocks(b, b.rotation - 1)
          let sb = this.lookingBlocks(b, b.rotation + 2)

          return sf != "plastanium-conveyor" &&
            !(
              sr && sr.type == type && !((sr.rotation - b.rotation + 5) % 4) ||
              sl && sl.type == type && !((sl.rotation - b.rotation + 3) % 4)
            ) &&
            sb && (
              this.names[sb.type] == "plastanium-conveyor-2" ||
              sb.type == type && (
                sb.rotation == b.rotation ||
                validOut(sb)
              )
            )
        }

        //plastanium-out
        this.blocks = this.blocks.map(b => {
          if (b.type != type) return b;

          if (validOut(b)) {
            if (outID < 0) outID = this.names.push("plastanium-conveyor-2") - 1
            b.type = outID;
          }
          return b;
        })
        //plastanium-inp
        this.blocks = this.blocks.map(b => {
          if (b.type != type) return b;

          let sf = this.lookingBlocks(b, b.rotation + 0)
          let sr = this.lookingBlocks(b, b.rotation + 1)
          let sb = this.lookingBlocks(b, b.rotation + 2)
          let sl = this.lookingBlocks(b, b.rotation + 3)

          let validIn = !(
            sb && [type, inID].includes(sb.type) && !((sb.rotation - b.rotation + 4) % 4) ||
            sr && [type, inID].includes(sr.type) && !((sr.rotation - b.rotation + 5) % 4) ||
            sl && [type, inID].includes(sl.type) && !((sl.rotation - b.rotation + 3) % 4)
          ) && !(sb && this.names[sb.type] == "plastanium-conveyor-2") &&
            sf && sf.type == type;

          if (validIn) {
            if (inID < 0) inID = this.names.push("plastanium-conveyor-1") - 1
            b.type = inID;
          }
          return b;
        })


        this.names = this.names.map(n => n == "plastanium-conveyor" ? "plastanium-conveyor-0" : n)
      }

    }

    /**
     * Retorna o schema de forma comprimida
     * @returns {Buffer}
     */
    toBuffer() {
      const SStruct = module.exports.StreamStructure;
      const SArray = new SStruct("short", "short", "json[1]", "string[1]", "block[4]")
        .setType("json", new SStruct("string", "string"))
        .setType("block", new SStruct("byte", "short", "short", [
          [], //0 - Maioria dos blocos nos quais não possui informação guardada
          // ex: copper-wall
          ["int"], //1 
          ["long"], //2
          ["float"],//3
          [[[], ["string"]]], //4 - Utilizado para carregar informações de um unico texto
          // ex: message
          ["byte", "short"], //5 - Utilizado para guardar Materiais/Fluidos/Objetos do jogo
          // ex: item-source, ordenator, 
          ["int[2]"], //6
          ["int", "int"], //7 - Utilizado para carregar cordenadas
          // ex: bridge-conveyor, mass-driver
          ["pos[1]"], //8 - Utilizada para carregar multiplas coordenadas pequenas
          // ex: power-node
          ["byte", "short"],//9 
          ["byte"], //10 - Utiliado para guardar informações booleanas ou de baixa variedade
          // ex: door, large-door, switch
          ["double"], //11
          ["int"], //12
          ["short"], //13
          ["Ubyte[4]"], //14 - Utilizado para guardar informações complexas
          // ex: processor
          ["byte"] //15 - ???
          // ex: command-center
        ], "byte"))
        .setType("pos", new SStruct("short", "short"));

      let blocks = this.blocks.map(v => [
        v.type || 0,
        v.position[0],
        v.position[1],
        [v.configt || 0 ,
        v.config || null],
        v.rotation || 0
      ])
      let tags = Object.entries(this.tags);

      let buffer = SArray.toBuffer(this.width,this.height,tags,this.names,blocks);

      let prefix = Buffer.alloc(5)
      prefix.write("msch", 0)
      prefix.writeInt8(1, 4)

      return Buffer.concat([prefix, zlib.deflateSync(buffer)])
    }

    /**
     * Retorna o bloco na posição x,y da schematica 
     * @param {Number} x - posição x
     * @param {Number} y - posição y
     * @param {Boolean?} name - Caso seja True, ira retornar apenas o nome
     * @returns {JSON|string}
     */
    getBlockAt(x, y, name = false) {
      if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
      let block = this.blocks[this.memory[x][y]]
      return name && block ? this.names[block.type] : block
    }

    /**
     * Atravez do ID retorna o bloco na qual o bloco principal esta olhando
     * @param {Number|Object} id - ID do bloco principal
     * @param {Number=} rot - Caso inserido, vai utilizar tal rotação como preferencia 
     * @param {Boolean=} name - Caso seja True, ira retornar apenas o nome
     * @returns {{type: Number,position: Number[],configt: Number,config:*,rotation: Number,size: Number}|string}
     */
    lookingBlocks(id, rot, name = false) {
      const block = isNaN(id) ? id : this.blocks[id];
      const pos = block.position
      const off = module.exports.Schematic.rotToPos(!isNaN(rot) ? rot : block.rotation)

      return this.getBlockAt(pos[0] + off[0] * block.size, pos[1] + off[1], name)
    }

    /**
     * Transforma o schematic em uma imagem
     * @param {{team: String}} [options]
     * @returns {Promise<Buffer>}
     */
    async toCanvas(options = { team: "sharded" }) {

      // Constantes
      const cons = {
        CONVEYOR: ["titanium-conveyor", "conveyor", "armored-conveyor", "conduit", "plated-conduit", "pulse-conduit"],
        ITEMSCONVEYOR: ["titanium-conveyor", "conveyor", "armored-conveyor"],
        LIQUIDSCONVEYOR: ["conduit", "plated-conduit", "pulse-conduit"],
        PLATEDCONVEYOR: ["plated-conduit", "armored-conveyor"],

        PAYLOADCONVEYOR: ["payload-conveyor"],
        PAYLOADROUTER: ["payload-router"],
        PAYLOAINPUTS: ["additive-reconstructor", "multiplicative-reconstructor", "exponential-reconstructor", "tetrative-reconstructor"],
        PAYLOABLOCKS: ["payload-conveyor", "payload-router", "air-factory", "naval-factory", "ground-factory", "additive-reconstructor", "multiplicative-reconstructor", "exponential-reconstructor", "tetrative-reconstructor"],

        STACKCONVEYOR: ["plastanium-conveyor"],

        BRIDGE: ["bridge-conveyor", "phase-conveyor", "bridge-conduit", "phase-conduit"],
        ITEMSBRIDGE: ["bridge-conveyor", "phase-conveyor"],
        LIQUIDSBRIDGE: ["bridge-conduit", "phase-conduit"],

        DOOR: ["door", "door-large"],
      }

      const teams = {
        "sharded": [[0.96, -0.61, 0.65], [-0.04, 1.35, -0.47], [0.32, 0.23, -0.06]],
        "derelict": [[0.02, 0.26, 0.03], [-0.01, 0.35, -0.04], [0.01, 0.32, 0.01]],
        "crux": [[-1.44, 4.9, -2.47], [0.74, -1.71, 1.53], [0.61, -0.96, 0.77]],
        "green": [[0.04, 0.23, 0.06], [0.01, 0.85, -0.02], [-0.01, 0.52, -0.03]],
        "purple": [[-0.01, 0.63, -0.02], [-0.02, 0.42, -0.05], [-0.01, 0.74, -0.04]],
        "blue": [[-0.04, 0.45, -0.06], [-0.02, 0.35, -0.04], [0.01, 0.93, -0.01]]
      }

      // Pegando os canvas
      let canvas = Canvas.createCanvas(this.width * 32, this.height * 32);
      let canvasM = Canvas.createCanvas(this.width * 32, this.height * 32);
      let canvasT = Canvas.createCanvas(this.width * 32, this.height * 32);
      let ctx = canvas.getContext("2d");
      let ctxM = canvasM.getContext("2d");
      let ctxT = canvasT.getContext("2d");

      // Pegando as imagens

      /** @type {{item: {name: String,color:String}[],liquid: {name: String,color:String}[]}} */
      const contentAll = JSON.parse(fs.readFileSync('./dataBank/mindustryContent.json'));
      const content = JSON.parse(fs.readFileSync('./dataBank/mindustryBlocks.json'));
      const atlas = JSON.parse(fs.readFileSync('./images/blocks.atlas'));
      let image = await Canvas.loadImage("./images/blocks.png");


      //Funções
      /**
       * 
       * @param {Canvas.CanvasRenderingContext2D} ctx
       */
      const draw = (ctx, item, x, y, rot) => {
        if (!item) item = atlas["error"];

        x = x * 32;
        y = (this.height - y) * 32 - 32

        let s = item[0] * 32;
        let px = x - s / 2 % 32 + 32;
        let py = y + s / 2 % 32; // - Math.floor(item[0] / 2) * 32;

        ctx.save()
        ctx.translate(px, py)

        if (rot) {
          ctx.rotate((rot || 0) * Math.PI / 2);
        }

        ctx.drawImage(
          image, // Image
          item[1] * 32, item[2] * 32, // Source Position
          s, s, // Source Size
          - s / 2, - s / 2, // Position
          s, s // Size
        );
        ctx.restore();
      }
      const bridgeEnd = (x, y) => {
        let block = this.getBlockAt(x, y);
        if (block.config[0] && block.config[1]) return true;
        if (!(block.config[0] || block.config[1])) return true;
        return false;
      };

      console.log(this.names)

      //Desenha blocos
      this.blocks.forEach((obj, i) => {
        const fastDraw = (name, rotation) => {
          draw(ctx, atlas[name], obj.position[0], obj.position[1], rotation);
        }
        let objName = this.names[obj.type];

        if (cons.PAYLOABLOCKS.includes(objName) && !cons.PAYLOADROUTER.includes(objName)) {

          if (cons.PAYLOADCONVEYOR.includes(objName)) {
            for (let i = 0; i < 4; i++) {

              let block = this.lookingBlocks(obj);

            }
          }


        } else if (cons.STACKCONVEYOR.some(v => new RegExp(`${v}-[012]`).test(objName))) { //StackConveyors

          const pos = obj.position;
          const rot = (4 - obj.rotation) % 4;
          const isStack = (objName) => objName && new RegExp(`${objName.slice(0, -2)}-[012]`).test(objName);

          fastDraw(objName, -obj.rotation);
          if (objName.endsWith(0)) {
            for (let i = 0; i < 4; i++) {
              let block = this.lookingBlocks(obj, i, true);
              if (
                !block || isStack(block) && rot != i &&
                (this.lookingBlocks(obj, i).rotation - i + 6) % 4 &&
                isStack(block) && block.endsWith("2") && (rot - i + 6) % 4
              ) {
                fastDraw(objName.slice(0, -1) + "edge", -i);
              }
            }
          } else if (objName.endsWith(1)) {
            for (let i = 0; i < 4; i++) {
              let block = this.lookingBlocks(obj, i, true);
              if (
                !content.items.includes(block) &&
                i != rot
              ) {
                fastDraw(objName.slice(0, -1) + "edge", -i);
              }
            }
          } else {
            for (let i = 0; i < 4; i++) {
              let block = this.lookingBlocks(obj, i, true);
              if (
                !content.items.includes(block) &&
                !isStack(block) ||
                (this.lookingBlocks(obj, i).rotation - i + 6) % 4
              ) {
                fastDraw(objName.slice(0, -1) + "edge", -i);
              }
            }
          }

        } else if (cons.CONVEYOR.includes(objName)) { //Conveyors


          let pos = obj.position;
          let rot = (4 - obj.rotation) % 4;
          let sides = [0, 0, 0, 0];
          let plated = cons.PLATEDCONVEYOR.includes(objName)
          let name = cons.ITEMSCONVEYOR.includes(objName) ? "items" : "liquids";

          for (let i = 0; i < 4; i++) {
            let x = pos[0] + (i - 1) % 2;
            let y = pos[1] + (2 - i) % 2;
            let block = this.getBlockAt(x, y, true);
            if (
              (!plated && content[name].includes(block)) ||
              (cons[`${name.toUpperCase()}CONVEYOR`].includes(block) && this.getBlockAt(x, y).rotation == (4 - i) % 4) ||
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

        } else if (cons.DOOR.includes(objName)) { //Doors
          fastDraw(obj.config[0] ? objName + "-open" : objName)
        } else { //Block itself

          if (atlas[objName]) { //Desenha caso encontre
            fastDraw(objName, 0);
          } else if (atlas[objName + "1"]) { //Desenha as variaveis
            let names = Object.keys(atlas).filter(v => new RegExp(objName + "\\d").test(v), 0);
            fastDraw(names[Math.floor(Math.random() * names.length)], 0)
          } else // Desenha o error
            fastDraw("error", 0);

          if (atlas[`${objName}-rotation`]) fastDraw(objName + "-rotation", -obj.rotation);
          if (!isNaN(obj.config) && atlas[`${objName}-config-${obj.config}`]) fastDraw(`${objName}-config-${obj.config}`, 0);
          if (atlas[`${objName}-top`]) fastDraw(objName + "-top", 0);
          if (atlas[`${objName}-team`]) draw(ctxT, atlas[objName + "-team"], obj.position[0], obj.position[1]);
        }
      })

      //Overlay de cor
      this.names.forEach((type, typeID) => {
        if (["unloader", "item-source", "sorter", "inverted-sorter", "liquid-source"].includes(type)) {

          let atlasBlock = atlas[type + "-center"] || atlas["color-center"]
          ctxM.globalCompositeOperation = "source-over";
          this.blocks.filter(block => block.type == typeID && block.config).forEach((block) => {
            ctxM.fillStyle = contentAll.item[block.config[1]].color;
            ctxM.fillRect(block.position[0] * 32, (this.height - block.position[1] - 1) * 32, 32, 32);

            ctxM.beginPath();
            ctxM.save()
            ctxM.rect(block.position[0] * 32, (this.height - block.position[1] - 1) * 32, 32, 32);
            ctxM.clip();

            ctxM.globalCompositeOperation = "destination-in";
            draw(ctxM, atlasBlock, block.position[0], block.position[1])
            ctxM.restore()
          });

        }
      });
      ctx.drawImage(canvasM, 0, 0);

      //Colorindo Times
      let data = ctxT.getImageData(0, 0, canvasT.width, canvasT.height);
      for (let i = 0; i < data.data.length; i += 4) {

        if (!data.data[i + 3]) continue;

        let r, g, b;
        let f = teams["crux"];

        r = data.data[i + 0] / 255;
        g = data.data[i + 1] / 255;
        b = data.data[i + 2] / 255;

        r = (f[0][0] + f[0][1] * r + f[0][2] * r * r) * 255;
        g = (f[1][0] + f[1][1] * g + f[1][2] * g * g) * 255;
        b = (f[2][0] + f[2][1] * b + f[2][2] * b * b) * 255;
        data.data[i + 0] = Math.min(Math.max(0, Math.round(r)), 255)
        data.data[i + 1] = Math.min(Math.max(0, Math.round(g)), 255)
        data.data[i + 2] = Math.min(Math.max(0, Math.round(b)), 255)

      }
      ctxT.putImageData(data, 0, 0);
      ctx.drawImage(canvasT, 0, 0);

      //Deixa tudo transparente
      ctx.globalAlpha = 0.8;

      //Desenha pontes
      this.names.forEach((type, typeID) => {
        if (cons.BRIDGE.includes(type)) {
          this.blocks.filter(obj => obj.type == typeID)
            .filter(obj => !(obj.config[0] && obj.config[1]))
            .forEach((obj) => {
              let block = this.getBlockAt(obj.position[0] + obj.config[0], obj.position[1] + obj.config[1]);
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


      return canvas;
    }

    /**
     * Retorna a posição relativa para tal rotação
     * @param {Number} rot
     * @returns {Number[]} 
     */
    static rotToPos(rot) {
      return [
        Math.round(Math.cos(rot * Math.PI / 2)),
        Math.round(Math.sin(rot * Math.PI / 2))
      ]
    }

  },
  //#endregion
}