const cors = require('cors');
const express = require('express');
const bulk = require('./index');

const app = express();

const ExpressCache = require('express-cache-middleware')
const cacheManager = require('cache-manager')

const cacheMiddleware = new ExpressCache(
  cacheManager.caching({
    store: 'memory', max: 10000, ttl: 36000
  })
);

cacheMiddleware.attach(app);

app.use(cors());

app.get('/', (req, res) => {
  bulk.bulkRequest().then(out => {
    res.send(JSON.stringify(out, null, 2));
  });
});

app.listen(3000, () =>
  console.log(`Example app listening on port 3000!`),
);
