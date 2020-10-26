const chalk = require("chalk");
const fs = require("fs");
const config = require("./config.json");
const format = require("date-fns/format");
const database = require("./database.js");

//--------------------------------------------------------------------------------------------------//
// Chalk config
var chalkClient = {
  chalk: chalk,
  error: chalk.bold.red,
  warn: chalk.bold.keyword('orange'),
  ok: chalk.bold.green
};

//--------------------------------------------------------------------------------------------------//
// Mix utils
/**
 * Checa se o usuario do ID fornecido faz parte do time de desenvolvedores
 * @param ID {String|Number} ID do usuario para checar
 * @returns {Boolean}
 */
var isDev = (ID) => {
  if (config.devsID.includes(ID)) return true;
  return false;
};

/**
 * Formata datas no estilo dd/MM/yyyy HH:mm:SS
 * @param date {Date} Data para formatar
 * @returns {String} Data formatada no estilo dd/MM/yyyy HH:mm:SS
 */
var formatDate = (date) => {
  return format(date - 10800000, "dd/MM/yyyy HH:mm:ss");
};

/**
 * Timer
 * @param ms {Number} Quantidade de tempo em milisegundos
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//--------------------------------------------------------------------------------------------------//
// Handler utils
/**
 * Checa se o caminho fornecido é uma pasta/diretorio
 * @param {String} path Caminho para o diretorio a ser checado
 * @returns {Boolean}
 */
var isDir = (path) => {
  try {
    var stat = fs.lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
};

//--------------------------------------------------------------------------------------------------//
// Error handler utils
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

  return `${Math.round(Math.random() * 100) * IDs.server * IDs.user * IDs.msg}`;
}

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
var newError = (err, fileName = "null", IDs = { server: null, user: null, msg: null }) => {
  if (!err) return;

  let folder = fs.existsSync('./errors');
  fileName = fileName.split('.')[0];
  let errorFileName = `${fileName ? fileName + "_" : ""}${format(new Date() - 10800000, "ddMMyyyy_HH:mm:ss")}.json`;
  let dados = {
    errorID: generateErrorID(fileName, IDs),
    msdate: Number(new Date() - 10800000),
    date: formatDate(new Date()),
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
};

/**
 * Lista todos os erros
 * @returns {Array} Array com os arquivos dos erros
 */
var listErrors = () => {
  if (!fs.existsSync("./errors")) return [];
  return fs.readdirSync("./errors");
};

/**
 * Procura um erro usando o ID
 * @param errorID {String|Number} ID do erro
 * @returns {Object}
 */
var searchErrorByID = (errorID) => {
  let errorFolder = listErrors();

  let errorSearched = errorFolder.filter(errorFile => {
    let errorData = require(`./errors/${errorFile}`);

    return errorData.errorID == errorID;
  });

  if (errorSearched.length() > 0) {
    errorSearched = errorSearched[0];
  } else {
    errorSearched = null;
  }

  return errorSearched;
}

/**
 * Limpa todos os erros
 */
var clearAllErrors = () => {
  let errorFolder = listErrors();

  errorFolder.forEach(errorFile => {
    fs.unlink(`./errors/${errorFile}`, (err) => { if (err) console.log("=> " + newError(err, errorFile)); });
  });

  return;
};

/**
 * Deleta um unico arquivo da pasta "errors"
 * @param file {String} Arquivo para excluir
 */
var deleteError = (file) => {
  let path = `./errors/${file}`;
  if (!file || !fs.existsSync(path)) throw new Error('Arquivo invalido!');

  fs.unlink(path, (err) => { if (err) console.log("\n=> " + newError(err, file)); });
  return;
};

//--------------------------------------------------------------------------------------------------//
// Math uitls
/**
 * @param norm {Number}
 * @param min {Number}
 * @param max {Number}
 * @returns {Number}
 */
var limp = (norm, min, max) => {
  return (max - min) * norm + min
}

//--------------------------------------------------------------------------------------------------//
// Json utils
/**
 * transforma um objeto em um .json
 * @param path {String} Caminho para o json a ser criado/substituido
 * @param object {Any}
 */
var jsonPush = (path, object) => {
  var data = JSON.stringify(object, null, 2);
  fs.writeFileSync(path, data, (err) => {
    if (err) throw err;
  });
  return false;
};

/**
 * transforma um .json em um objeto
 * @param path {String} Caminho para o json a ser transformado
 * @returns {object} 
 */
var jsonPull = (path) => {
  var data = fs.readFileSync(path);
  return JSON.parse(data);
};

/**
 * Pega um .json e utiliza em uma função
 * @param path {String} Caminho para o json usado
 * @param func {function} função para utilizar o func
 */
var jsonChange = async (path, func, min = 0) => {
  let bal = jsonPull(path);
  const ret = func(bal);

  if (typeof ret === 'object' && ret !== null) {
    if (Object.keys(ret).length >= min) {
      await jsonPush(path, ret);
    } else {
      console.log(`=> ${newError(new Error(`O tamanho do objeto (${Object.keys(ret).length}) foi menor que o esperado (${min})`), "utils_jsonChange")}`);
    }
  };
};

//--------------------------------------------------------------------------------------------------//
// Level system util
/**
 * Configuração do sistema de level
 * @param [XPconfig] {Object} Opções do sistema de level
 * @param [XPconfig.modPerLVL=1.2] {Number} Modificador da quantidade de XP por level
 * @param [XPconfig.maxLVL=50] {Number} Level maximo
 * @param [XPconfig.defaultXPnextLVL=500] {Number} Quantidade padrao para upar de level
 * @returns {void}
 */
var setupXPconfig = (XPconfig = { modPerLVL: 1.2, maxLVL: 50, defaultXPnextLVL: 500 }) => {
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

  if (JSON.stringify(jsonPull("./dataBank/levelSystem.json")) == JSON.stringify(XPdataArray)) return;
  fs.writeFileSync("./dataBank/levelSystem.json", JSON.stringify(XPdataArray), { encoding: "utf8" });
  return;
}

//--------------------------------------------------------------------------------------------------//
// Exports
module.exports = {
  chalkClient: chalkClient,
  isDir: isDir,
  formatDate: formatDate,
  sleep: sleep,
  listErrors: listErrors,
  newError: newError,
  clearAllErrors: clearAllErrors,
  deleteError: deleteError,
  isDev: isDev,
  limp: limp,
  jsonPush: jsonPush,
  jsonPull: jsonPull,
  jsonChange: jsonChange,
  setupXPconfig: setupXPconfig
};