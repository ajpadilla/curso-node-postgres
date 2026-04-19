const request = require('supertest');

const buildApp = require('../../../app');
const { User } = require('../../../database/models/user.model');
const { sequelize } = require('../../../database/sequelize');

describe('Users E2E - Create', () => {
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

  test('should create a user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@test.com',
        password: '12345678',
        role: 'customer',
      })
      .expect(201);

    // ✅ Basic assertions
    expect(response.body.email).toBe('test@test.com');
    expect(response.body).toHaveProperty('id');

    // 🔐 Security rule: password must NOT be exposed
    expect(response.body.password).toBeUndefined();

    // ✅ Optional: verify user really exists in DB
    const userInDb = await User.findOne({
      where: { email: 'test@test.com' },
    });

    expect(userInDb).toBeDefined();
    expect(userInDb.email).toBe('test@test.com');
  });

  test('should fail when email already exists', async () => {
    // First user
    await request(app)
      .post('/api/v1/users')
      .send({
        email: 'duplicate@test.com',
        password: '12345678',
        role: 'customer',
      })
      .expect(201);

    // Second user with same email
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'duplicate@test.com',
        password: '12345678',
        role: 'customer',
      })
      .expect(409); // or 400 depending on your implementation

    expect(response.body).toMatchObject({
      statusCode: 409,
      error: 'Conflict',
      message: 'Email already registered',
    });
  });
});
