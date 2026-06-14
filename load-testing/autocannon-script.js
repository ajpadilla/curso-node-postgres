const autocannon = require('autocannon');
const WinstonLogger = require('../ecommerce/infrastructure/logger/WinstonLogger');

const logger = new WinstonLogger();

autocannon(
  {
    url: 'http://localhost:3000',
    connections: 50,
    duration: 30,
    requests: [
      {
        method: 'POST',
        path: '/api/v1/users',
        setupRequest: (req) => {
          const uniqueEmail = `test_${process.hrtime.bigint()}@test.com`;

          req.body = JSON.stringify({
            email: uniqueEmail,
            password: '12345678',
            role: 'customer',
          });

          req.headers = {
            'Content-Type': 'application/json',
          };

          return req;
        },
      },
    ],
  },
  (err, result) => {
    if (err) {
      logger.error('Autocannon failed', { error: err });
      return;
    }

    logger.info('Autocannon results', {
      requests: result.requests,
      latency: result.latency,
      throughput: result.throughput,
    });
  }
);
