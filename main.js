const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');

// para toda a vez q o bot for iniciado
client.on("ready", () => {
	const channel = client.channels.cache.get("724005420058017812");
	
	console.log(`Bot foi logado como ${client.user.tag}`);
	client.user.setActivity("!help para ajuda",{type:"WATCHING"});
	channel.send("O bot foi iniciado")
});

// para toda a vez q uma mensagem for enviada
client.on("message", async message => {

	// acaba a função caso a mensagem, for de um bot, for na dm ou se n tiver o prefixo 
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	if(!message.content.startsWith(config.prefix)) return;

	//separando argumentos e comandos
	const args =  message.content.slice(config.prefix.length).trim().split(/ +/g);
	const commando = args.shift().toLowerCase();
	const user = message.mentions.users.first(); //usuario mencionado

	//comandos

	if(commando === "ping") { //testar o ping

		const m = await message.channel.send("Ping?");
		m.edit(`Pong! A latência é ${m.createdTimestamp - message.createdTimestamp}ms.`);

	} else
	if(commando === "help") { //comando help

		message.channel.send("**[NORMAL]**\n ping, help\n**[MOD]**\n warn, purge");

	} else
	if(commando === "warn" && user && message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR")) {
		
		const channel = message.guild.channels.cache.find(ch => ch.name === 'punição');
		let embed = new Discord.MessageEmbed()
			.setColor('#FFFF00')
			.setAuthor(message.author.tag,message.author.displayAvatarURL())
			.setTitle('Aviso!')
			.setDescription(`${user} levou warn. Motivo:\n\n${ args[1] ? args.slice(1).join(" ") : "[Nenhum motivo foi dado]" }`)
			.setThumbnail(user.displayAvatarURL({dynamic: true, format: "png", size: 1024}));

		await channel.send(embed);

	} else
	if(commando === "purge" && parseInt(args[0]) && message.member.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR")) {
		
		message.channel.bulkDelete(parseInt(args[0]) + 1)
			.then(messages => message.channel.send(`Foram deletadas ${messages.size - 1} mensagens.`))
			.catch(console.error);
		
	}
	
});

client.login(config.token);