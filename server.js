// Serverless環境でのサーバーコード
const express = require('express');
const serverless = require('serverless-http');
const app = require('./server');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
module.exports.handler = serverless(app);


/*
// Localhost環境でのサーバーコード
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});*/