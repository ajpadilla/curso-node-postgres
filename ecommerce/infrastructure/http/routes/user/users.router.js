const express = require('express');
const validatorHandler = require('../../middlewares/validator.handler');
const { updateUserSchema, createUserSchema, getUserSchema } = require('./user.schema');
const { httpErrorMapper } = require('../../error-mapper');
function createUserRouter(userService) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const users = await userService.find();
      res.json(users);
    } catch (error) {
      next(httpErrorMapper(error));
    }
  });

  router.get('/:id', validatorHandler(getUserSchema, 'params'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await userService.findOne(id);
      res.json(category);
    } catch (error) {
      next(httpErrorMapper(error));
    }
  });

  router.post('/', validatorHandler(createUserSchema, 'body'), async (req, res, next) => {
    try {
      const body = req.body;
      const user = await userService.create(body);
      res.status(201).json(user);
    } catch (error) {
      next(httpErrorMapper(error));
    }
  });

  router.patch(
    '/:id',
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const body = req.body;
        const category = await userService.update(id, body);
        res.json(category);
      } catch (error) {
        next(httpErrorMapper(error));
      }
    },
  );

  router.delete('/:id', validatorHandler(getUserSchema, 'params'), async (req, res, next) => {
    try {
      const { id } = req.params;
      await userService.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(httpErrorMapper(error));
    }
  });

  return router;
}

module.exports = createUserRouter;
