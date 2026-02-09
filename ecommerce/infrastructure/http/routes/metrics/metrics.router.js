// ecommerce/infrastructure/http/routes/metrics/metrics.router.js
const express = require('express');
const client = require('prom-client');

const router = express.Router();

router.get('/metrics', async (_, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

module.exports = router;
