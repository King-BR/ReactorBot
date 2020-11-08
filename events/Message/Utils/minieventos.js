const { Users } = require('../../../database.js');

module.exports = (client, botUtils, message) => {
	newError = botUtils.newError;
	try {
		// detecta os mini eventos
		if (message.author.bot) return;

		botUtils.jsonChange(
			'./dataBank/serverState.json',
			obj => {
				if (obj.eventType === null) {
					message.delete();
					return;
				}

				let correct = false;

				if (Array.isArray(obj.eventWin)) {
					const values = message.content.match(/\-?\d+/g);

					if (values && values.length == obj.eventWin.length) {
						values.sort();
						correct = !values.some((element, index) => {
							return element != obj.eventWin[index];
						});
					}
				} else {
					correct = message.content.toLowerCase() == obj.eventWin;
				}

				if (correct) {
					message.channel.overwritePermissions([
						{ id: '700183808783286372', allow: 805829713 },
						{ id: '755665930159390721', deny: 2112 },
						{ id: '699823229354639471', allow: 66624, deny: 805763089 }
					]);
					message.react('✅');

					const money = Math.floor(Math.random() * 5 + 5);
					const xp = Math.floor(Math.random() * 50 + 100);

					message.channel.send(`Respondeu certo! ganhou ${money}\$ e ${xp} xp`);

					obj.eventWin = null;
					obj.eventType = null;

					let XPconfig = require('../../../dataBank/levelSystem.json');

					Users.findById(message.author.id, (err, doc) => {
						if (err) {
							console.log(
								'\n=> ' +
									newError(err, 'utils_updateDBxp', { user: message.author.id })
							);
							return;
						}

						if (!doc) {
							let newUser = new Users({
								_id: message.author.id,
								money: money,
								levelSystem: {
									xp: xp,
									txp: xp
								}
							});
							newUser.save();
							return obj;
						}

						if (
							doc.levelSystem.xp + xp >=
							XPconfig[doc.levelSystem.level - 1].XPNextLevel
						) {
							doc.levelSystem.xp = doc.levelSystem.xp + xp - XPconfig[doc.levelSystem.level - 1].XPNextLevel;
							doc.levelSystem.txp += xp;
							doc.levelSystem.level++;
						} else {
							doc.levelSystem.xp += xp;
							doc.levelSystem.txp += xp;
						}

						doc.money += money;

						doc.save();
					});

					return obj;
				} else {
					message.react('❌');
				}

				return obj;
			},
			5
		);
	} catch (err) {
		let IDs = {
			server: message.guild.id,
			user: message.author.id,
			msg: message.id
		};
		console.log(`=> ${newError(err, 'ClientMessage_Minieventos', IDs)}`);
	}
};
