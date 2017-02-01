var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../public'));

app.get('/', (req, res) => {
  res.sendFile('main.html', {root: __dirname + '/../public'});
});

app.get('/test', (req, res) => {
  res.send({success: true});
});

app.listen(3000, () => {
  console.log('Server is running at port 30000');
});