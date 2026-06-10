const express = require('express');

module.exports = function bootstrapRouter({
  app,
  userRouter,
  authRouter,
  viewRouter,
  metricsRouter,
  healthRouter,
}) {
  const router = express.Router();

  app.use('/api/v1', router);

  router.use('/users', userRouter.getRouter());

  router.use('/auth', authRouter.getRouter());

  router.use('/', viewRouter.getRouter());

  app.use('/metrics', metricsRouter.getRouter());

  app.use('/health', healthRouter.getRouter());
};
