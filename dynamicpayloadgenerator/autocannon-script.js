const autocannon = require('autocannon');

autocannon({
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
          role: 'customer'
        });

        req.headers = {
          'Content-Type': 'application/json'
        };

        return req;
      }
    }
  ]
}, console.log);
