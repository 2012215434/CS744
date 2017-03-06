const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('../db/db')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(__dirname + '/../public'));

app.get('/', (req, res) => {
  res.sendFile('main.html', {root: __dirname + '/../public'});
});

app.get('/test', (req, res) => {
  res.send({success: true});
});

app.post('/test', (req, res) => {
  console.log(req.body.test);
  res.send(req.body);
});

app.post('/run', (req, res) => {
  db.recordCreate(req.body, (err, result) => {
    if (err) console.log(err);
    else if (result) return res.send({success: true});

    res.send({success: false});
  });
});

app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
