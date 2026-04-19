const express = require('express');
const { httpErrorMapper } = require('../../error-mapper');

class SessionRouter {
  constructor({ authService, authenticate }) {
    this.router = express.Router();
    this.service = authService;
    this.authenticate = authenticate;

    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create session (Login)
    this.router.post('/', this.authenticate, this.create.bind(this));

    // Destroy current session (Logout)
    this.router.delete('/current', this.destroy.bind(this));
  }

  async create(req, res, next) {
    try {
      const user = req.user;
      const token = this.service.signToken(user);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false, // true in production
        sameSite: 'lax',
      });

      return res.status(201).json({
        type: 'session',
        accessToken: token,
      });
    } catch (error) {
      next(httpErrorMapper(error));
    }
  }

  async destroy(req, res) {
    res.clearCookie('access_token');
    return res.status(204).send();
  }

  getRouter() {
    return this.router;
  }
}

module.exports = SessionRouter;
