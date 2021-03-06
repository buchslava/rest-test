const cors = require('cors');
const express = require('express');
const bulk = require('./index');

const app = express();

let interval;

app.use(cors());

app.get('/', (req, res) => {
  const out = app.get('out');

  if (out) {
    res.send(out);
    return;
  }

  if (!bulk.working && !out) {
    bulk.bulkRequest().then(out => {
      out = JSON.stringify(out, null, 2);
      app.set('out', out);
      res.send(out);
    });
  } else if (!out){
    interval = setInterval(() => {
      if (!bulk.working) {
        clearInterval(interval);
        res.send(out);
      }
    }, 1000);
  }
});

app.listen(3000, () =>
  console.log(`Example app listening on port 3000!`),
);
