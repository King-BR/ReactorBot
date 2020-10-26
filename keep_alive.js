const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('How did you get this link?');
})
 
app.listen(3000);