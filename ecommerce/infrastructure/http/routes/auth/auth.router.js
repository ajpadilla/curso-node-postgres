const express = require('express');
const { httpErrorMapper } = require('../../error-mapper');

class AuthRouter {
  constructor({ authService, authenticate }) {
    this.router = express.Router();
    this.service = authService;
    this.authenticate = authenticate;

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/login', this.authenticate, this.login.bind(this));

    this.router.post('/recovery', this.recovery.bind(this));

    // ✅ ADD THIS
    this.router.get('/logout', this.logout.bind(this));
  }

  async login(req, res, next) {
    try {
      const user = req.user;
      const token = this.service.signToken(user);

      res.cookie('access_token', token, {
        httpOnly: true, // JS cannot read it
        secure: false, // true in production (https)
        sameSite: 'lax',
      });

      res.status(200).json({ token });
    } catch (error) {
      // eslint-disable-next-line no-console
      next(httpErrorMapper(error));
    }
  }

  async recovery(req, res, next) {
    try {
      const { email } = req.body;

      const result = await this.service.sendMail(email);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    res.clearCookie('access_token');
    return res.redirect('/api/v1/login');
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AuthRouter;
