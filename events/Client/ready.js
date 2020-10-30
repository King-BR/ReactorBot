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


    //atividade do bot
    client.user.setActivity("!ajuda para a lista de comandos", { type: "WATCHING" });

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
          const ret = require("./utils/minievents.js")(client, botUtils, server, editing);
          server.eventType = ret[1];
          server.eventWin = ret[0];

          server.nextMiniquiz = d.getTime() + Math.floor((Math.random() + 1) * 20 * 60 * 1000);
        }

        if (server.nextMsgOfDay < d.getTime()) {
          const channel = guild.channels.cache.get("738471925004632104");

          if (!editing) {
            const message = require("./utils/messageofday.js")(client, botUtils, server);
            channel.send('"' + message + '"\n\n-ReactorBot')
          }

          server.nextMsgOfDay = Math.floor(d.getTime() / (12 * 60 * 60 * 1000) + 2) * 12 * 60 * 60 * 1000;
        }

        if (server.nextMsgChange < d.getTime()) {

          botUtils.jsonChange('./dataBank/mesTotal.json', obj => {
            obj.messages.pop();
            obj.messages.unshift({});
            return obj;
          });

          server.nextMsgChange = Math.floor(d.getTime() / (3 * 60 * 60 * 1000) + 1) * 3 * 60 * 60 * 1000;

          guild.members.cache.each(member => {
            const messages = botUtils.jsonPull('./dataBank/mesTotal.json').messages
            let number = 0;
            const active = messages.some(per => {
              number += per[member.user.id] || 0
              return number > 10
            })
            if (active) {
              member.roles.add("769938641338236968")
            } else if (member.roles.cache.get("769938641338236968")) {
              member.roles.remove("769938641338236968")
            }
          });
        }

        return server;
      }, 5);

    }, 20 * 1000);

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady")}`);
  }
}