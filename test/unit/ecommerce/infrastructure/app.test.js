const request = require('supertest');
const app = require('../../../../app');

describe('App integration tests', () => {

  describe('GET /', () => {
    it('should return 200 and welcome message', async () => {
      const res = await request(app).get('/');

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Hola mi server en express');
    });
  });

  describe('GET /nueva-ruta (protected)', () => {

    it('should return 401 if api key is missing', async () => {
      const res = await request(app).get('/nueva-ruta');

      expect(res.statusCode).toBe(401);
    });

    it('should return 200 if api key is valid', async () => {
      const res = await request(app)
        .get('/nueva-ruta')
        .set('api', '333224'); // match your middleware

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Hola, soy una nueva ruta');
    });

  });

});
