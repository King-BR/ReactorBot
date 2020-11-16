module.exports = ({ client, botUtils }) => {
  newError = botUtils.newError;
  try {
    const guild = client.guilds.cache.get("699823229354639471");

    //log no console
    console.log(`\nBot foi logado como ${client.user.tag}`)
    console.log("Iniciado em " + botUtils.formatDate(new Date()));

    // Tempo q o bot levou pra começar
    botUtils.jsonChange('./dataBank/serverState.json', server => {

      const dTime = (new Date()).getTime() - server.serverStarted - 10800000
      console.log(`Demorou ${Math.floor(dTime / 60000)}:${(Math.floor(dTime / 1000) % 60).toString().padStart(2, '0')}  para iniciar\n`);

    }, true);

    // Reactor reaction
    require('./utils/reactionRole')(client, botUtils, guild)
    // Delete propostas
    require('./utils/deleteProp')(client, botUtils, guild)

    //atividade do bot
    client.user.setActivity("!ajuda para a lista de comandos", { type: "WATCHING" });


    //Tempos
    client.setInterval(async () => {
      const d = new Date();

      //verifica se o tempo dos mutes ja esgotaram
      botUtils.jsonChange('./dataBank/mutedlist.json', muted => {
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

        const editing = false;
        const guild = client.guilds.cache.get("699823229354639471");

        //se o proximo miniquiz ja chegou  
        if (server.nextMiniquiz < d.getTime()) {

          //pega as respostas e o tipo do evento
          const ret = require("./utils/minievents.js")(client, botUtils, server);
          server.eventType = ret[1];
          server.eventWin = ret[0];

          server.nextMiniquiz = d.getTime() + Math.floor((Math.random() + 1) * 20 * 60 * 1000);
        }

        // Mensagem do dia/Intervalo24h 
        if (server.nextMsgOfDay < d.getTime()) {
          const channel = guild.channels.cache.get("738471925004632104");

          if (!editing) {
            const message = require("./utils/messageofday.js")(client, botUtils, server);
            //channel.send('"' + message + '"\n\n-ReactorBot')
          }

          const message = require("./utils/dayInterval.js")(client, botUtils, server, guild);

          server.nextMsgOfDay = Math.floor(d.getTime() / (12 * 60 * 60 * 1000) + 2) * 12 * 60 * 60 * 1000;
        }

        return server;
      }, 5);

    }, 20 * 1000);

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady")}`);
  }
}