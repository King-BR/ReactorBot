module.exports = ({ client, botUtils }) => {
    newError = botUtils.newError;
    try{
        const guild = client.guilds.cache.get("699823229354639471");
	
	    console.log(`\nBot foi logado como ${client.user.tag}`);
	    client.user.setActivity("!ajuda para a lista de comandos",{type:"WATCHING"});
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
    } catch(err) {
        console.log(`=> ${newError(err, "ClientReady")}`);
    }
}