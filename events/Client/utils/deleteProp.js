const botUtils = require("../../../utils.js");

module.exports = (client) => {
  newError = botUtils.newError;
  try {

    

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady_MessageOfDay")}`);
  }
}