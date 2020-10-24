module.exports = (client, botUtils, message) => {
  newError = botUtils.newError;
  try {
    // detecta os mini eventos
    if (message.author.bot) return;

    botUtils.jsonChange('./dataBank/serverState.json', obj => {
      
      if(obj.eventType === null) return message.delete();

      let correct = false;
      if (obj.eventType == 2) {
        
        const values = message.content.match(/\-?\d+/g)

        values.sort()

        if (values.length == obj.eventWin.length) {
          correct = !values.some((element,index)=>{
            return element != obj.eventWin[index]
          })
        }
        
      } else {
        
        correct = message.content.toLowerCase() == obj.eventWin

      };

      if (correct) {

        message.channel.overwritePermissions([{ id: "700183808783286372", allow: 805829713 }, { id:"755665930159390721", deny: 2112 }, { id: "699823229354639471", allow: 66624, deny: 805763089},]);
        message.react('✅');

        const money = Math.floor(Math.random() * 5 + 5);
        const xp = Math.floor(Math.random() * 50 + 100);
            
        message.channel.send(`Respondeu certo! ganhou ${money}\$ e ${xp}xp`);

        botUtils.jsonChange('./dataBank/balance.json', balance => {
          balance[message.author.id] = (balance[message.author.id] || 0) + money;
          return balance;
        });
        botUtils.jsonChange('./dataBank/experience.json', balance => {
          balance[message.author.id] = (balance[message.author.id] || 0) + xp;
          return balance;
        });
          
        obj.eventWin = null
        obj.eventType = null
      } else {
        message.react('❌');
      }
    });

  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${newError(err, "ClientMessage_Minieventos", IDs)}`);
  }
}