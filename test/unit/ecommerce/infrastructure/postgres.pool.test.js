// test/infrastructure/postgres.pool.test.js
const { pool } = require('../../../../database/postgres.pool');

describe('Postgres Pool', () => {
  afterAll(async () => {
    await pool.end(); // close all connections
  });

  it('should connect to the database', async () => {
    const res = await pool.query('SELECT 1+1 AS result');
    expect(res.rows[0].result).toBe(2);
  });

  it('should have a pool object', () => {
    expect(pool).toBeDefined();
    expect(typeof pool.query).toBe('function');
  });
});
