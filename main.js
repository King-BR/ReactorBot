const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

// para toda a vez q o bot for iniciado
client.on("ready", () => {
	console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
	client.user.setGame("Testando Bot");
});

// para toda a vez q uma mensagem for enviada
client.on("message", async message => {

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	const args =  message.content.slice(config.prefix.length).trim().split(/ +/g);
	const commando = args.shift().toLowerCase();

	if(comando === "ping") {
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! A latência é ${m.createdTimestamp - message.createdTimestanp}ms. A Latência da API é ${math.round(client.ping)}.ms`);
	}
});

client.login(config.token);