const botUtils = require("../../../utils.js");

module.exports = (client, server, editing) => {
  newError = botUtils.newError;
  try {

    const guild = client.guilds.cache.get("699823229354639471");

    const getMember = function() {return guild.roles.cache.get("769938641338236968").members.random()};
    
    const messages = [
      "Bom dia meus consagrado, eu vos desejo um dia de sorte",
      `Não ia falar nada, mas eu vi ${getMember()}, saindo da mata com ${getMember()}`,
      `Ouvi dizer que o ${getMember()} consegue mamar ${Math.floor(2.3/(1-Math.random()))} pessoas ao msm tempo`,
      `ALA, o ${getMember()} chamo o  ${getMember()} de boboca. Vai deixar?`,
      `#${getMember()}ParaPresidente`
    ]
    
    const m = messages[Math.floor(Math.random()*messages.length)];

    return m;

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady_MessageOfDay")}`);
  }
}