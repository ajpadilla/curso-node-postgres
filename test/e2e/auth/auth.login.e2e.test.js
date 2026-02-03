const request = require('supertest');

const buildApp = require('../../../app');
const {User} = require("../../../database/models/user.model");
const {sequelize} = require("../../../database/sequelize");


describe('Auth E2E - Login', () => {
  let app;
  let server;

  beforeAll(() => {
    app = buildApp();
    server = app.listen(0); // random free port
  });

  afterAll(async () => {
    await server.close();
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  test('should return JWT when credentials are valid', async () => {
    await request(app)
      .post('/api/v1/user')
      .send({ email: 'login@test.com', password: '12345678', role: 'customer' })
      .expect(201);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: '12345678' })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(20);
  });

  test('should return 401 when credentials are invalid', async () => {
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: 'wrongpass' })
      .expect(401);
  });
});
