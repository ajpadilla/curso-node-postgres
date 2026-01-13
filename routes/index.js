const express = require('express');

const productsRouter = require('../domains/products/products.router');
const categoriesRouter = require('../domains/categories/categories.router');
const usersRouter = require('../domains/users/users.router');
const orderRouter = require('../domains/orders/orders.router');
const customersRouter = require('../domains/customers/customers.router');
const authRouter = require('../domains/auth/auth.router');
const profileRouter = require('../domains/profile/profile.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/orders', orderRouter);
  router.use('/customers', customersRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
}

module.exports = routerApi;
