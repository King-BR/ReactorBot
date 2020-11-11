// NPM requires
const chalk = require("chalk");
const fs = require("fs");
const format = require("date-fns/format");
const md5 = require("md5");

// Files requires
const config = require("./config.json");


//--------------------------------------------------------------------------------------------------//
// Error handler private utils
/**
 * @param [fileName="null"] {String} Arquivo onde ocorreu o erro
 * @param [IDs] {Object} IDs involvidos
 * @param [IDs.server=0] {String|Number} ID do server
 * @param [IDs.user=0] {String|Number} ID do usuario
 * @param [IDs.msg=0] {String|Number} ID da mensagem
 */
function generateErrorID(fileName = "null", IDs = { server: 0, user: 0, msg: 0 }) {
  let errorID = `${fileName}_${module.exports.formatDate(new Date())}_${IDs.server}-${IDs.user}-${IDs.msg}`;
  errorID = md5(errorID);
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
   * Checa se o usuario do ID fornecido faz parte do time de desenvolvedores
   * @param ID {String|Number} ID do usuario para checar
   * @returns {Boolean}
   */
  isTester: (ID) => {
    if (config.testersID.includes(ID)) return true;
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

  /**
   * Retorna as mudanças entre para a array1 virar a array2
   * @param {array} tabela original
   * @param {array} tabela modificada
   * @returns {array} mudanças necessarias para a transformação
   */
  arrDiference: (arr1, arr2) => {

    const err = (desc) => {
      return console.log("=> " + newError(new Error(desc), 'utils_arrDiference'));
    }

    if (!Array.isArray(arr1)) return err('arr1 não é uma array');
    if (!Array.isArray(arr2)) return err('arr2 não é uma array');

    let t1 = arr1.map(t => t.toString().trim());
    let t2 = arr2.map(t => t.toString().trim());

    let matriz = [];

    //criando a matriz
    for (let x = 0; x <= t1.length; x++) {
      matriz[x] = [];
      for (let y = 0; y <= t2.length; y++) {
        matriz[x][y] = '??';
      }
    }

    //colocando os numeros
    matriz[0][0] = '0m';
    t1.forEach((t, i) => { matriz[i + 1][0] = i + 1 + 'm' });
    t2.forEach((t, i) => { matriz[0][i + 1] = i + 1 + 'm' });

    let equal = true;

    //calculando
    for (let x = 1; x <= t1.length; x++) {
      for (let y = 1; y <= t2.length; y++) {
        let score = t1[x - 1] == t2[y - 1] ? 0 : 1;

        let numbers = [
          parseInt(matriz[x - 1][y]) + 1,
          parseInt(matriz[x][y - 1]) + 1,
          parseInt(matriz[x - 1][y - 1]) + score
        ]
        let min = Math.min.apply(null, numbers);

        matriz[x][y] = min + (['d', 'i', t1[x - 1] == t2[y - 1] ? 'm' : 's'])[numbers.findIndex(n => n == min)];

      }
    }

    //calculando resultado
    let changes = [];
    let x = t1.length - 1;
    let y = t2.length - 1;
    let cont;
    do {

      cont = x + y > 0

      switch (matriz[x + 1][y + 1].slice(-1)) {
        case 'd':
          changes.push([y + 1 + '-', t1[x]]);
          x--;
          break;
        case 'i':
          changes.push([y + 1 + '+', t2[y]]);
          y--;
          break;
        case 's':
          changes.push([y + 1 + '+', t2[y]]);
          changes.push([y + 1 + '-', t1[x]]);
        case 'm':
          x--;
          y--;
          break;
      }
    } while (cont)

    return changes.reverse();
  },

  /**
   * Retorna uma pagina
   * @param channel {Channel} o canal onde vai ser enviado 
   * @param size {Number} quantidade de paginas
   * @param func {Function} a função realizada por pagina 
   */
  createPage: (channel, size, func) => {
    let page = 1;

    channel.send(func(1) || 'nill').then(msg => {
      if(size == 1) return;
      msg.react('➡️').catch(err => console.log(err))

      const filter = (reaction, user) => {
        return ['➡️', '⬅️'].includes(reaction.emoji.name) && !user.bot
      };

      let collector = msg.createReactionCollector(filter, {idle: 30000});

            collector.on("collect", (r, u) => {
              if (r.emoji.name == '➡️') {
                page++;
                msg.edit(func(page) || 'nill');
                msg.reactions.removeAll().then(() =>{
                  msg.react('⬅️').then(() => {
                    if(page < size) msg.react('➡️').catch(err => console.log(err));
                  }).catch(err => console.log(err));
                }).catch(err => console.log(err));
              } else {
                page--;
                msg.edit(func(page) || 'nill');
                msg.reactions.removeAll().then(() =>{
                  Promise.all(page > 1?[msg.react('⬅️')]:[]).then(() => {
                    msg.react('➡️').catch(err => console.log(err));
                  }).catch(err => console.log(err))
                }).catch(err => console.log(err));
              }
            })

            collector.on("end", collected => {
              if (collected.size > 0) return;
              msg.reactions.removeAll();
            });

    })

  },
  //--------------------------------------------------------------------------------------------------//
  // Clan utils

  /**
   * Gera um ID para o clã
   * @param foundersID {String[]} Array com o ID dos fundadores do clã
   * @returns {String} ID do clã
   */
  generateClanID: (foundersID) => {
    let clanID = `${module.exports.formatDate(new Date())}_${foundersID.join("-")}`;
    clanID = md5(clanID);
    return clanID.slice(0, 10);
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
      msdate: Number(new Date()),
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
      green = parseInt(red[1]);
      blue = parseInt(red[2]);
      alpha = parseInt(red[3]);
      red = parseInt(red[0]);
    }

    if (!isNaN(red)) {
      str = '';
      //transforma os valores em numeros
      red = parseInt(red);
      green = parseInt(green);
      blue = parseInt(blue);
      alpha = parseInt(alpha);
      //arredonda os numeros pros campos legiveis
      if (!isNaN(red)) red = Math.min(Math.max(0, red), 255);
      if (!isNaN(green)) green = Math.min(Math.max(0, green), 255);
      if (!isNaN(blue)) blue = Math.min(Math.max(0, blue), 255);
      if (!isNaN(alpha)) alpha = Math.min(Math.max(0, alpha), 255);

      // red,blue => escala de cinza e alpha
      if (isNaN(blue)) {
        str += red.toString(16).padStart(2, '0');
        str += red.toString(16).padStart(2, '0');
        str += red.toString(16).padStart(2, '0');
        if (!isNaN(green)) str += green.toString(16).padStart(2, '0');
      } else {
        str += red.toString(16).padStart(2, '0');
        str += green.toString(16).padStart(2, '0');
        str += blue.toString(16).padStart(2, '0');
        if (!isNaN(alpha)) str += alpha.toString(16).padStart(2, '0');
      }

      str = '#' + str.toUpperCase();

    } else if (Array.isArray(red)) {

      str = [];

      for (let ar of red) {
        str.push(module.exports.toColor(ar));
      }

    } else {
      str = '#' + Math.floor(Math.random() * (2 ** 24 - 1)).toString(16).padStart(6, '0').toUpperCase();
    }

    return str;
  },

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
        return module.exports.hexToRgb(str);

      } else if (str.toLowerCase() == 'random') {
        return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];

      } else {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : null;
      }

    } else if (Array.isArray(str)) {
      let out = [];
      str.forEach(string => {
        out.push(module.exports.hexToRgb(string));
      })
      return out;

    } else {
      console.log(`=> ${module.exports.newError(new Error("Que poha de entrada que tu boto aqui?"), "Utils_hexToRgb")}`);
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
  // Level system utils

  /**
   * Configuração do sistema de level
   * @param [XPconfig] {Object} Opções do sistema de level
   * @param [XPconfig.modPerLVL=1.2] {Number} Modificador da quantidade de XP por level
   * @param [XPconfig.maxLVL=50] {Number} Level maximo
   * @param [XPconfig.defaultXPnextLVL=500] {Number} Quantidade padrao para upar de level
   * @returns {void}
   */
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
}