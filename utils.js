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
}

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
 * Cria o log de um novo erro
 * @param err {Error} Erro que aconteceu
 * @param [fileName] {String} Nome do arquivo onde que aconteceu o erro
 * @param [IDs] {String|Number} IDs relacionados ao erro
 * @param [IDs.server] {String|Number} ID do server
 * @param [IDs.user] {String|Number} ID do usuario
 * @param [IDs.msg] {String|Number} ID da mensagem
 * @returns {String} String para logar no console
 */
var newError = (err, fileName, IDs) => {
    if (!err) return;

    let folder = fs.existsSync('./errors');
    fileName = fileName.split('.')[0];
    let errorFileName = `${fileName ? fileName + "_" : ""}${format(new Date(), "ddMMyyyy_HHmmSS")}.json`;
    let data = {
        date: format(new Date(), "dd/MM/yyyy HH:mm:SS"),
        msg: err.message || null,
        stack: err.stack || null,
        IDs: {
            server: IDs.server || null,
            user: IDs.user || null,
            msg: IDs.msg || null
        }
    }

    if (!folder) {
        fs.mkdirSync('./errors');
    }
    fs.writeFileSync(`./errors/${errorFileName}`, JSON.stringify(data, null, 2), { encoding: 'utf8' });

    return `${chalkClient.error('Erro detectado!')}\nVeja o log em: ./errors/${errorFileName}`;
}

/**
 * Limpa todos os erros
 */
var clearErrors = () => {
    let errorFolder = fs.readdirSync('./errors');
    if(errorFolder) {
        errorFolder.forEach(errorFile => {
            fs.unlink(`./errors/${errorFile}`, (err) => {
                console.log(newError(err, errorFile));
            });
        });
    }
}

/**
 * Checa se o usuario do ID fornecido faz parte do time de desenvolvedores
 * @param {String|Number} ID ID do usuario para checar
 * @returns {Boolean}
 */
var isDev = (ID) => {
    if(config.devsID.includes(ID)) return true;
    return false;
}

/**
 * Pega um .json e utiliza em uma função
 * @param {String} path Caminho para o json usado
 * @param {function} func função para utilizar o func
 */
var jsonChange = (path,func) => {
    let bal = jsonPull(path)
    jsonPush(path,func(bal) || bal)
}

/**
 * transforma um objeto em um .json
 * @param {String} path Caminho para o json a ser criado/substituido
 * @param {object}   
 */
var jsonPush = (path,object) => {
    var data = JSON.stringify(object,null,2)
    fs.writeFile(path, data, (err) => {
        if (err) throw err;
      });
    return false;
}

/**
 * transforma um .json em um objeto
 * @param {String} path Caminho para o json a ser transformado
 * @returns {object} 
 */
var jsonPull = (path) => {
    var data = fs.readFileSync(path);
    return JSON.parse(data);
}

// Exports
module.exports = {
    chalkClient: chalkClient,
    isDir: isDir,
    newError: newError,
    clearErrors: clearErrors,
    isDev: isDev,
    jsonPush: jsonPush,
    jsonPull: jsonPull,
    jsonChange: jsonChange
}