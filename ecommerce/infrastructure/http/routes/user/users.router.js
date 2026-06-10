const express = require('express');
const validatorHandler = require('../../middlewares/validator.handler');
const { updateUserSchema, createUserSchema, getUserSchema } = require('./user.schema');
const asyncHandler = require('../../async-handler');

class UserRouter {
  constructor({ userService }) {
    this.router = express.Router();
    this.service = userService;

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', asyncHandler(this.find.bind(this)));

    this.router.get(
      '/:id',
      validatorHandler(getUserSchema, 'params'),
      asyncHandler(this.findOne.bind(this)),
    );

    this.router.post(
      '/',
      validatorHandler(createUserSchema, 'body'),
      asyncHandler(this.create.bind(this)),
    );

    this.router.patch(
      '/:id',
      validatorHandler(getUserSchema, 'params'),
      validatorHandler(updateUserSchema, 'body'),
      asyncHandler(this.update.bind(this)),
    );

    this.router.delete(
      '/:id',
      validatorHandler(getUserSchema, 'params'),
      asyncHandler(this.delete.bind(this)),
    );
  }

  async find(req, res) {
    const users = await this.service.find();
    res.status(200).json(users);
  }

  async findOne(req, res) {
    const { id } = req.params;
    const user = await this.service.findOne(id);
    res.status(200).json(user);
  }

  async create(req, res) {
    const body = req.body;
    const user = await this.service.create(body);
    res.status(201).json(user);
  }

  async update(req, res) {
    const { id } = req.params;
    const body = req.body;
    const user = await this.service.update(id, body);
    res.status(200).json(user);
  }

  async delete(req, res) {
    const { id } = req.params;
    await this.service.delete(id);
    res.status(204).send();
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UserRouter;
