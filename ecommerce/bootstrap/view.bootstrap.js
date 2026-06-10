const authSessionMiddleware = require('../infrastructure/http/middlewares/auth-session.middleware');

const ViewRouter = require('../infrastructure/http/routes/view/view.router');

module.exports = function bootstrapView({ authService }) {
  const authMiddleware = authSessionMiddleware(authService);

  const viewRouter = new ViewRouter({
    authMiddleware,
  });

  return {
    authMiddleware,
    viewRouter,
  };
};
