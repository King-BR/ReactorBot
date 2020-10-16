module.exports = ({ client, botUtils }) => {
    newError = botUtils.newError;
    try{
	    const channel = client.channels.cache.get("724005420058017812");
	
	    console.log(`\nBot foi logado como ${client.user.tag}`);
	    client.user.setActivity("!ajuda para a lista de comandos",{type:"WATCHING"});
        //channel.send("O bot foi iniciado");
    } catch(err) {
        console.log(`=> ${newError(err, "ClientReady")}`);
    }
}