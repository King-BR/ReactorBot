const botUtils = require("../../utils.js");

module.exports = (client, /* Resto das variaveis */) => {
  newError = botUtils.newError;

  try {
    // Codigo do evento

  } catch (err) {
    console.log(`=> ${newError(err, "nome do evento")}`);
  }
}