const format = require("date-fns/format");

module.exports = ({ client, botUtils }) => {
  newError = botUtils.newError;
  try {
    const guild = client.guilds.cache.get("699823229354639471");

    //log no console
    console.log(`\nBot foi logado como ${client.user.tag}`);
    console.log("Iniciado em " + format(new Date(), "dd/MM/yyyy HH:mm:SS"));

    //atividade do bot
    client.user.setActivity("!ajuda para a lista de comandos", { type: "WATCHING" });

    //mute
    client.setInterval(async () => {
      const d = new Date();
    
      //verifica se o tempo dos mutes ja esgotaram
      await botUtils.jsonChange('./dataBank/mutedlist.json', muted => {
        for (let userid in muted) {
          if (Math.sign(muted[userid]) * (d.getTime() - muted[userid]) > 0) {
            delete muted[userid];
            const user = client.users.cache.get(userid);
            user.send(`Você foi desmutado do server ${guild}`);
            guild.member(user).roles.remove(guild.roles.cache.get("755665930159390721"), 'A duração do mute ja foi completa');
            console.log(`o ${user.tag}(${user}) foi desmutado.`);
          }
        }
        return muted;
      });

    
      //verifica se ja esta na hora do evento
      botUtils.jsonChange('./dataBank/serverState.json', server => {

        
        if (server.lastEvent < d.getTime()) {
          const ret = require("./utils/minievents.js")(client, botUtils, server);
          server.eventType = ret[1];
          server.eventWin = ret[0];
          server.lastEvent = d.getTime() + Math.floor(( Math.random() + 1 ) * 20 * 60 * 1000);
          return server;
        }

      });

    }, 20 * 1000);

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady")}`);
  }
}