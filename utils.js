const chalk = require("chalk");
const fs = require("fs");

// Chalk config
var chalkClient = {
    chalk: chalk,
    error: chalk.bold.red,
    warn: chalk.bold.keyword('orange'),
    ok: chalk.bold.green
}

// Handler utils
/**
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

// Error handler
/**
 * @param err {Error} Erro que aconteceu
 * @param [fileName] {String} Nome do arquivo onde que aconteceu o erro
 * @param [id] {String|Number} Id do server e/ou user do erro
 * @returns {String} String para logar no console
 */
var newError = (err, fileName, id) => {
    if (!err) return;
    let folder = fs.existsSync('./errors');
    fileName = fileName.split('.')[0];
    let data = `${err.message}\n\n${err.stack}`;
    let errorFileName = `${fileName ? fileName + "_" : ""}${id ? id + "_" : ""}Error.log`
    if (folder) {
        fs.writeFileSync(`./errors/${errorFileName}`, data, { encoding: 'utf8' });
    } else {
        fs.mkdirSync('./errors');
        fs.writeFileSync(`./errors/${errorFileName}`, data, { encoding: 'utf8' });
    }
    return `${chalkClient.error('Erro detectado!')}\nVeja o log em: ./errors/${errorFileName}`;
}

// Limpar errors antigos
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

// Exports
module.exports = {
    chalkClient: chalkClient,
    isDir: isDir,
    newError: newError,
    clearErrors: clearErrors
}