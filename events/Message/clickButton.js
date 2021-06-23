const botUtils = require("../../utils.js");
const Discord = require("discord.js");
const disbut = require("discord-buttons");

/**
 * @param {Discord.Client} client
 * @param {disbut.ButtonInteraction} button
 */
module.exports = (client, button) => {
	newError = botUtils.newError;
	
	try {

		if (button.id == "Bom Dia") {

			button.reply.send(`Bom dia ${button.clicker.member.displayName}`)

		} else if (button.id.startsWith("miniquiz#")) {

			const serverState = botUtils.jsonPull("./dataBank/serverState.json");
			const miniquizChannel = client.channels.cache.get('768238015830556693');

			if (![6].includes(serverState.eventType)) return button.defer(true);

			if (Object.values(serverState.miniquizChooses).some(v => v.some(u => u === button.clicker.member.id))) return;

			if (button.id === 'miniquiz#' + serverState.eventWin) {

				botUtils.closeMiniquiz(client, button.clicker.member.id, 6)
			
			} else {
			
				button.reply.send(`\`${button.clicker.member.user.tag}\` errou`);
				let category = serverState.miniquizChooses[button.id.slice(9)];
				
				if (category)
					category.push(button.clicker.member.id);
				else
					serverState.miniquizChooses[button.id.slice(9)] = [button.clicker.member.id];
				
				botUtils.jsonPush("./dataBank/serverState.json", serverState);
			}
		}

	} catch (err) {
		console.log(`=> ${newError(err, "clickButton")}`);
	}
}