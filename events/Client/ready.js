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

    client.setInterval(async () => {
      const d = new Date();

      botUtils.jsonChange('./dataBank/serverState.json', server => {

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
      }, 2);

    }, 20 * 1000);

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady")}`);
  }
}