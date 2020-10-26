module.exports = (client, botUtils, server, editing) => {
  newError = botUtils.newError;
  try {
    const channel = client.channels.cache.get("768238015830556693");
    if (server.eventWin) channel.send('Ninguem respondeu certo u.u');

    //funções do evento

    const choose = [
      function() {

        const n1 = Math.floor(Math.random() * 400 + 100);
        const n2 = Math.floor(Math.random() * 400 + 100) * (Math.random() < 0.5 ? -1 : 1);

        const quest = `Qual é o resultado de \`${n1} ${n2 < 0 ? '-' : '+'} ${Math.abs(n2)}\` ?`;
        const resp = (n1 + n2).toString();

        return [quest, resp];
      }, function() {

        const palavras = [
          "Mindustry", "Anuke", "Núcleo", "Cofre", "Muro", "Muralha", "Porta", "Esteira-Ponte", "Roteador", "Bateria", "Reparador", "Esteira", "Incinerador", "Pulverisador",
          "Magma", "Piche",
          "Fusão", "Espectro", "Ciclone", "Ondulação", "Enxame", "Salvo", "Onda", "Queimada", "Dupla", "Dispersão", "Granizo", "Lançador",
          "Revenã", "Tridente", "Lich", "Erradicador", "Fortaleza", "Titã", "Omega", "Alfa", "Delta", "Tau", "Javelin", "Glaive", "Eruptor",
          "Cobre", "Chumbo", "Metavidro", "Grafite", "Areia", "Carvão", "Titânio", "Tório", "Sucata", "Silício", "Plastânio", "Surto", "Esporos", "Piratita",
          "Escória", "Petróleo", "Água"
        ];

        const resp = palavras[Math.floor(Math.random() * palavras.length)];

        let word = resp.split("");
        let quest = '';

        while (word.length > 0) {
          quest += word.splice(Math.floor(Math.random() * word.length), 1);
        }

        quest = `Desembaralhe a palavra: \`${quest}\``;

        return [quest, resp.toLowerCase()];
      }, function() {

        const power = 2-Math.ceil(Math.log10(0.5-Math.random()/2));

        let val = [];
        for (let i=0;i<power;i++){val.push(Math.floor(Math.random()*19 - 9));}

        const pstr = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

        const f = function(t, arr, p = 1, m = 1) {
          if (t == 0) return [1];
          let ar = []
          for (let i = m; i <= arr.length - t + 1; i++) {
            if (t == 1) {
              ar.push(-arr[i - 1])
            } else {
              let a = f(t - 1, arr, p + 1, m + 1);
              a.forEach((ele) => { ar.push(-arr[i - 1] * ele) });
              m++;
            }
          }
          return ar
        }
        let res = '';
        for (let t = 0; t <= val.length; t++) {
          let a = f(t, val);
          let numb = 0;
          a.forEach((element) => {
            numb += element
          });
          if (numb !== 0) {
            let pot = val.length - t;
            let strpot = '';
            pot.toString().split().forEach((element) => { strpot += pstr[parseInt(element)]; });
            res += numb > 0 ? ' + ' : ' - ';
            res += (Math.abs(numb) == 1 && pot > 0) ? '' : Math.abs(numb);
            res += pot > 0 ? 'x' : '';
            res += pot > 1 ? strpot : '';
          }
        }
        res = res.slice(2);
        val.sort();

        return [`Quais são as raises de \`${res}\``, val];
      }
    ];


    // Codigo


    //escolhe um evento aleatorio
    number = Math.floor(Math.random() * choose.length)
    quest = choose[number]();

    //se estiver no modo de edição (editing true)
    //o bot n vai mandar mensagens no #miniquiz e nem vai permiter pessoas falarem
    if (!editing){
      channel.send('> ' + quest[0]);
      channel.overwritePermissions([{ id: "700183808783286372", allow: 805829713 }, { id: "755665930159390721", deny: 2112 }, { id: "699823229354639471", allow: 68672, deny: 805761041 }]);
    }

    //retorna a resposta e o tipo do evento
    return [quest[1], number];

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady_Minievents")}`);
  }
}