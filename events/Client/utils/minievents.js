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

        const palavras = botUtils.jsonPull('./dataBank/textSaves.json').quizWords;
        const resp = palavras[Math.floor(Math.random() * palavras.length)];

        let word = resp.split("");
        let quest = '';

        while (word.length > 0) {
          quest += word.splice(Math.floor(Math.random() * word.length), 1);
        }

        quest = `Desembaralhe a palavra: \`${quest}\``;

        return [quest, resp.toLowerCase()];
      }, function() {

        const power = 2 - Math.ceil(Math.log10(0.5 - Math.random() / 2));

        let val = [];
        for (let i = 0; i < power; i++) { val.push(Math.floor(Math.random() * 19 - 9)); }

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

        return [`Quais são as raízes de \`${res}\``, val];
      }, function() {
        const resp = [Math.floor(Math.random() * 20 - 10), Math.floor(Math.random() * 20 - 10)]

        let str = 'Qual é o valor de `x` e `y` do sistema \n```'

        let mx1 = Math.floor(Math.random() * 3 + 1) * (Math.random() < 0.5 ? -1 : 1)
        let my1 = Math.floor(Math.random() * 3 + 1) * (Math.random() < 0.5 ? -1 : 1)

        str += `${mx1 < 0 ? '-' : ''}${Math.abs(mx1) == 1 ? '' : Math.abs(mx1)}x `
        str += `${my1 < 0 ? '-' : '+'} ${Math.abs(my1) == 1 ? '' : Math.abs(my1)}y `
        str += `= ${mx1 * resp[0] + my1 * resp[1]}\n`

        let mx2;
        let my2;

        do {
          mx2 = Math.floor(Math.random() * 3 + 1) * (Math.random() < 0.5 ? -1 : 1)
          my2 = Math.floor(Math.random() * 3 + 1) * (Math.random() < 0.5 ? -1 : 1)

        } while (mx1 / mx2 == my1 / my2)

        str += `${mx2 < 0 ? '-' : ''}${Math.abs(mx2) == 1 ? '' : Math.abs(mx2)}x `
        str += `${my2 < 0 ? '-' : '+'} ${Math.abs(my2) == 1 ? '' : Math.abs(my2)}y `
        str += `= ${mx2 * resp[0] + my2 * resp[1]}\n`

        str += '```'
        return [str, resp]
      }, function() {
        const palavras = botUtils.jsonPull('./dataBank/textSaves.json').quizWords;
        const resp = palavras[Math.floor(Math.random() * palavras.length)];
        const quant = Math.floor((1 - Math.log10(1 - Math.random())) * resp.length / 4);

        const mutate = (str) => {

          let op = Math.floor(Math.random() * 3)
          let letter = Math.floor(Math.random() * 26 + 10).toString(36)
          let arr = quest.split("");

          if (op == 0) {
            arr.splice(Math.random() * arr.length, 1, letter);
          } else if (op == 1) {
            arr.splice(Math.random() * arr.length, 0, letter);
          } else if (op == 2) {
            arr.splice(Math.random() * arr.length, 1);
          }

          return arr.join("");
        }

        let quest = resp

        for (let i = 0; i < quant; i++) { quest = mutate(quest) }

        quest = `Deu um erro no arquivo(${quant}x), descubra a palavra:\`${quest}\``

        return [quest, resp.toLowerCase()];
      }
    ];


    // Codigo


    //escolhe um evento aleatorio
    number = Math.floor(Math.random() * choose.length)
    quest = choose[number]();

    //se estiver no modo de edição (editing true)
    //o bot n vai mandar mensagens no #miniquiz e nem vai permiter pessoas falarem
    if (!editing) {
      channel.send('> ' + quest[0]);
      channel.overwritePermissions([{ id: "700183808783286372", allow: 805829713 }, { id: "755665930159390721", deny: 2112 }, { id: "699823229354639471", allow: 68672, deny: 805761041 }]);
    }

    //se for array, vai organizar pra n ter ordem certa de resposta
    if (Array.isArray(quest[1])) quest[1].sort();

    //retorna a resposta e o tipo do evento
    return [quest[1], number];

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady_Minievents")}`);
  }
}