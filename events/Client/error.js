const botUtils = require("../../utils.js");

module.exports = (client, error) => {
    newError = botUtils.newError;
    console.log(`=> ${newError(err, "ClientError")}`);
}