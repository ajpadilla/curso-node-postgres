// tests/infrastructure/postgres.client.test.js
const { getConnection } = require('../../database/postgres.client');

describe('Postgres Client', () => {
  let client;

  beforeAll(async () => {
    client = await getConnection();
  });

  afterAll(async () => {
    await client.end();
  });

  it('should connect to the database', async () => {
    const res = await client.query('SELECT 1+1 AS result');
    expect(res.rows[0].result).toBe(2);
  });

  it('should return a client object with query function', () => {
    expect(client).toBeDefined();
    expect(typeof client.query).toBe('function');
  });
});
