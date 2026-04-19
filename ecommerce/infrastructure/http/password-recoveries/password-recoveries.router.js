const express = require('express');
const { httpErrorMapper } = require('../../error-mapper');

class PasswordRecoveryRouter {
  constructor({ authService }) {
    this.router = express.Router();
    this.service = authService;

    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create recovery request
    this.router.post('/', this.create.bind(this));
  }

  async create(req, res, next) {
    try {
      const { email } = req.body;

      await this.service.sendMail(email);

      return res.status(201).json({
        type: 'password-recovery',
        message: 'Recovery email sent if account exists',
      });
    } catch (error) {
      next(httpErrorMapper(error));
    }
  }

  getRouter() {
    return this.router;
  }
}

module.exports = PasswordRecoveryRouter;
