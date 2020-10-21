const format = require("date-fns/format");

module.exports = ({ client, botUtils }) => {
    newError = botUtils.newError;
    try{
        const guild = client.guilds.cache.get("699823229354639471");
        
        //log no console
	      console.log(`\nBot foi logado como ${client.user.tag}`);
        console.log("Iniciado em " + format(new Date(),"dd/MM/yyyy HH:mm:SS"));

        //atividade do bot
	      client.user.setActivity("!ajuda para a lista de comandos",{type:"WATCHING"});

        //mute
        client.setInterval(() => {
            const d = new Date();

            //verifica se o tempo dos mutes ja esgotaram
            let muted = botUtils.jsonPull('./dataBank/mutedlist.json')
            for (let userid in muted) {
                
                if( Math.sign(muted[userid])*(d.getTime() - muted[userid]) > 0){
                    delete muted[userid];
                    const user = client.users.cache.get(userid);
                    user.send(`Você foi desmutado do server ${guild}`);
                    guild.member(user).roles.remove(guild.roles.cache.get("755665930159390721"),'A duração do mute ja foi completa');
                    console.log(`o ${user.tag}(${user}) foi desmutado.`);
                }

            }
            botUtils.jsonPush('./dataBank/mutedlist.json',muted);

        }, 20 * 1000);
        
        //client.setInterval(() => {
            
          const n1 = Math.floor(Math.random()*400+100);
          const n2 = Math.floor(Math.random()*400+100)* (Math.random()<0.5 ? -1 : 1);
          const channel = client.channels.cache.get("768238015830556693");
            
          channel.send(`\`${n1} ${n2<0?'-':'+'} ${Math.abs(n2)}\` `);

          botUtils.jsonChange('./dataBank/serverState.json',obj => {
            obj.eventWin = n1 + n2;
            return obj;
          });
          channel.overwritePermissions([{id: "700183808783286372",allow:805829713},{id: "755665930159390721",deny:2112},{id: "699823229354639471",allow:68672,deny:805761041}]);
        //}, 2.7*60*60 * 1000);

    } catch(err) {
        console.log(`=> ${newError(err, "ClientReady")}`);
    }
}