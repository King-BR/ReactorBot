const dotenv = require("dotenv");
const express = require('express');
const utils = require("./utils");
const os = require('os');
const cpuStat = require("cpu-stat");


const app = express();

app.get('/', (req, res) => {
  let data = {
    online: true,
    userSize: Object.keys(utils.jsonPull('./usersConfig.json').players).length
  };

  return res.send(data);
});

app.get('/stats', (req, res) => {
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      console.log(err);
      return res.send({ error: err });
    }

    let data = {
      error: false,
      memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      platform: `${os.platform()} ${os.arch()}`,
      cpu: `${os.cpus().map(i => `${i.model}`)[0]}`,
      cpuUsed: `${percent.toFixed(2)}%`
    }

    return res.send(data);
  });
});

app.get('/info/:userID', (req, res) => {
  if(!req.query || !req.query.key || req.query.key != process.env.KEY) return res.send({ error: "Sem autorização"});
  
  let user = req.params.userID;
  let data = utils.jsonPull('./usersConfig.json');
  let userData = data.players[user];

  if(userData) {
    userData.found = true;
    return res.send(userData);
  }

  return res.send({ found: false });
});

app.listen(3000, () => {
  console.log('Canvas module started');
});