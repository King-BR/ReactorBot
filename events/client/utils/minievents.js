module.exports = (client, botUtils, server) => {
  newError = botUtils.newError;
  try {
    const channel = client.channels.cache.get("768238015830556693");
    if (server.eventWin) channel.send('Ninguem respondeu certo u.u');


    const choose = [
      function() {

        const n1 = Math.floor(Math.random() * 400 + 100);
        const n2 = Math.floor(Math.random() * 400 + 100) * (Math.random() < 0.5 ? -1 : 1);

        const quest = `> Qual é o resultado de \`${n1} ${n2 < 0 ? '-' : '+'} ${Math.abs(n2)}\` ?`;
        const resp = (n1 + n2).toString();

        return [quest, resp];
      }, function() {

        const palavras = ["Mindustry", "Tório", "Titânio", "Fusão", "Revenã", "Tridente", "Espectro", "Ciclone", "Lich", "Erradicador", "Fortaleza", "Petróleo"];

        const resp = palavras[Math.floor(Math.random() * palavras.length)];

        let word = resp.split("");
        let quest = '';

        while (word.length > 0) {
          quest += word.splice(Math.floor(Math.random() * word.length), 1);
        }

        quest = `Desembaralhe a palavra: \`${quest}\``;

        return [quest, resp];
     }
    ];
    
    const quest = choose[Math.floor(Math.random() * choose.length)]();

    channel.send(quest[0]);
    channel.overwritePermissions([{ id: "700183808783286372", allow: 805829713 }, { id: "755665930159390721", deny: 2112 }, { id: "699823229354639471", allow: 68672, deny: 805761041 }]);
    
    return quest[1].toLowerCase();

  } catch (err) {
    console.log(`=> ${newError(err, "ready_minievents")}`);
  }
}