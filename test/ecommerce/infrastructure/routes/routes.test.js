const request = require('supertest');
const express = require('express');
const createUserRouter = require('../../../../ecommerce/infrastructure/http/routes/user/users.router');

describe('GET /user', () => {
  it('returns user', async () => {
    const fakeService = {
      find: jest.fn().mockResolvedValue([{ id: 1 }]),
    };

    const app = express();
    app.use(express.json());
    app.use('/user', createUserRouter(fakeService));

    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(fakeService.find).toHaveBeenCalled();
  });
});
