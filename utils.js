const chalk = require("chalk");
const fs = require("fs");
const config = require("./config.json");
const format = require("date-fns/format");

// Chalk config
var chalkClient = {
  chalk: chalk,
  error: chalk.bold.red,
  warn: chalk.bold.keyword('orange'),
  ok: chalk.bold.green
};

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

/**
 * Formata datas no estilo dd/MM/yyyy HH:mm:SS
 * @param date {Date} Data para formatar
 * @returns {String} Data formatada no estilo dd/MM/yyyy HH:mm:SS
 */
var formatDate = (date) => {
  return format(date, "dd/MM/yyyy HH:mm:SS");
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
 * Cria o log de um novo erro
 * @param err {Error} Erro que aconteceu
 * @param [fileName=null] {String} Nome do arquivo onde que aconteceu o erro
 * @param [IDs=null] {Object} IDs relacionados ao erro
 * @param [IDs.server=null] {String|Number} ID do server
 * @param [IDs.user=null] {String|Number} ID do usuario
 * @param [IDs.msg=null] {String|Number} ID da mensagem
 * @returns {String} String para logar no console
 */
var newError = (err, fileName = null, IDs = { server: null, user: null, msg: null }) => {
  if (!err) return;

  let folder = fs.existsSync('./errors');
  fileName = fileName.split('.')[0];
  let errorFileName = `${fileName ? fileName + "_" : ""}${format(new Date() - 10800000, "ddMMyyyy_HH:mm:SS")}.json`;
  let dados = {
    msdate: Number(new Date() - 10800000),
    date: formatDate(new Date() - 10800000),
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
 * Limpa todos os erros
 */
var clearAllErrors = () => {
  let errorFolder = listErrors();

  errorFolder.forEach(errorFile => {
    fs.unlink(`./errors/${errorFile}`, (err) => { if (err) console.log("=> " + newError(err, errorFile)); });
  });

  console.log("\nErrors limpos\n");
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
 * transforma um objeto em um .json
 * @param path {String} Caminho para o json a ser criado/substituido
 * @param object {Any}
 */
var jsonPush = (path, object) => {
  var data = JSON.stringify(object, null, 2);
  fs.writeFile(path, data, (err) => {
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
var jsonChange = (path, func) => {
  let bal = jsonPull(path);
  jsonPush(path, func(bal) || bal);
};

// Exports
module.exports = {
  chalkClient: chalkClient,
  isDir: isDir,
  formatDate: formatDate,
  listErrors: listErrors,
  newError: newError,
  deleteError: deleteError,
  clearAllErrors: clearAllErrors,
  deleteError: deleteError,
  isDev: isDev,
  jsonPush: jsonPush,
  jsonPull: jsonPull,
  jsonChange: jsonChange,
};