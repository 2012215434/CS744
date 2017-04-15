const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('../db/db');

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

app.get('/run', (req, res) => {
  if (req.query.start && req.query.end) {
    db.getRecordByTime(Number(req.query.start), Number(req.query.end), (err, result) => {
      if (err) console.log(err);
      else if (result) return res.send({success: true, result});
      res.send({success: false});
    });
  } else if (req.query.description) {
    db.getRecordByDescription(req.query.description, (err, result) => {
      if (err) console.log(err);
      else if (result) return res.send({success: true, result});
      res.send({success: false});
    });
  } else {
    res.send({success: false});
  }
});

app.get('/runs',(req ,res)=>{
  let {startTime, endTime, envSize, regionNum, steps, description}= req.query;
  console.log(req.query);
  db.getAllRecords(function(err,records){
    if (err) {
      res.send(err)
    } else {
      let result = records.filter((run)=>{
        if (
          ((run.environment.length == envSize.split(',')[1]&&run.environment[0].length==envSize.split(',')[0])||envSize==null)
          &&
          ((startTime<run.id && endTime > run.id)||(startTime == null && endTime==null))
          &&
          ((run.description.indexOf(description)>-1)||description==null)
          &&
          ((run.regions.length == regionNum)||regionNum==null)
          &&
          ((run.steps == steps)||steps == null)
      ) {
          return true;
        }
        return false;
      })
      res.send(result);
    }
  })
})

app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
