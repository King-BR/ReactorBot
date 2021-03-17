const botUtils = require("../../../utils.js");

module.exports = (client, botUtils, server, editing) => {
  newError = botUtils.newError;
  try {
    const channel = client.channels.cache.get("768238015830556693");
    if (server.eventWin) {
      const frases = [
        'Ninguem respondeu certo u.u, a resposta era `@r`.',
        'Garaio só tem ameba aqui ?, tava na cara que era `@r`.',
        'Os cara é muito néscio mano kkkkkk,conseguem nem ver que a reposta é `@r`.',
        'vejo dentro dos meus arquivos que a resposta é `@r`.',
        'se tivessem falado `@r`, teriam acertado, mas jeito ne.',
        '`@r`,`@r`,`@r`!! Quantas vezes eu vo precisar falar ?',
        'Tão obvio quem nem vo falar, vão ficar curioso msm kkkkkkk.',
        'Não é possivel que os cara não saiba q a resposta é `@r`.',
        'Em plena `@h` da manhã, os caras não falam um simples `@r`',
        '┌(˵ ͡° ͜ʖ ͡°˵)=ε[`@r`]	(✜ ︵✜  )',
        '...',
      ]
      const data = new Date(new Date().getTime() - 3 * 3600 * 1000)
      channel.send(
        "> " + frases[~~(Math.random() * frases.length)]
          .replace(/@r/g, Array.isArray(server.eventWin) ? server.eventWin.join(" ") : server.eventWin)
          .replace("@h", `${data.getHours()}:${data.getMinutes()}`)
      );
    }

    //funções do evento

    const choose = [
      function() { // Soma

        const n1 = Math.floor(Math.random() * 400 + 100);
        const n2 = Math.floor(Math.random() * 400 + 100) * (Math.random() < 0.5 ? -1 : 1);

        const quest = `Qual é o resultado de \`${n1} ${n2 < 0 ? '-' : '+'} ${Math.abs(n2)}\` ?`;
        const resp = (n1 + n2).toString();

        return [quest, resp];
      },
      function() { // Shuffle

        const palavras = botUtils.jsonPull('./dataBank/textSaves.json').quizWords;
        const resp = palavras[Math.floor(Math.random() * palavras.length)];
        const shuffle = (word) => {

          word = word.split("");
          let res = '';

          while (word.length > 0) {
            res += word.splice(Math.floor(Math.random() * word.length), 1);
          }

          return res
        }

        quest = `Desembaralhe a palavra: \`${resp.split(' ').map(s => shuffle(s)).join(' ')}\``;

        return [quest, resp.toLowerCase()];
      },
      function() { // Raizes

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
      },
      function() { // Sistema
        const resp = [Math.floor(Math.random() * 20 - 10), Math.floor(Math.random() * 20 - 10)]
        let str = `Qual é o valor de \`x\` e \`y\` do sistema\n\`\`\`\nx·y = ${resp[0] * resp[1]}\nx+y = ${resp[0] + resp[1]}\`\`\``
        return [str, resp];
      },
      function() { // Error
        const palavras = botUtils.jsonPull('./dataBank/textSaves.json').quizWords;
        const resp = palavras[Math.floor(Math.random() * palavras.length)];
        const quant = Math.max(Math.floor((1 - Math.log10(1 - Math.random())) * resp.length / 4), 1);

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

        do {
          for (let i = 0; i < quant; i++) { quest = mutate(quest) }
        } while (quest == resp)

        quest = `Uma palavra foi corrompida(${quant}x), descubra a palavra:\`${quest}\``

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

      let color = number / choose.length
      color = '#' + [0, 0, 0].map((n, i) => Math.max(1 - Math.max(Math.abs((color * 6 + i * 2) % 6 - 2) - 1, 0), 0))
        .map(n => Math.floor(n * 255).toString(16).padStart(2, '0')).join('')

      channel.send({ embed: { description: quest[0], color: color } });
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