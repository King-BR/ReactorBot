const { Users } = require("../database.js");
const botUtils = require("../utils.js");

newError = botUtils.newError;

Users.findById("id do usuario", (errDB, doc) => {
  // Caso aconteça um erro na database
  if (errDB) {
    console.log(`=> ${newError(errDB, "nome do arquivo")}`);
    return;
  }

  // Caso não exista usuario com esse id na database
  if (!doc) {
    // Cria o novo usuario
    let newUser = new Users({
      _id: "id do usuario"
    });

    // Salva o novo usuario na database
    newUser.save();
    return;
  }

  try {
    // Aqui você manipula os dados do usuario
    // Exemplos

    // Add 50 de dinheiro para o usuario
    doc.money += 50;

    // Add 50 de xp para o usuario
    doc.levelSystem.xp += 50;
    doc.levelSystem.txp += 50;

    // Salva as alterações na database
    doc.save();
  } catch (err) {
    // Handler de erros
    console.log(`=> ${newError(err, "nome do arquivo")}`);
  }
});