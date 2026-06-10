const bootstrapSecurity = require('./security.bootstrap');

const bootstrapObservability = require('./observability.bootstrap');

const bootstrapMetrics = require('./metrics.bootstrap');

const bootstrapHealth = require('./health.bootstrap');

const bootstrapRouter = require('./register-routes.bootstrap');

const bootstrapErrors = require('./error.bootstrap');

const bootstrapAuth = require('./auth.bootstrap');

const bootstrapUser = require('./user.bootstrap');

const bootstrapView = require('./view.bootstrap');

// -----------------------------
// Create dependencies
// -----------------------------

const security = bootstrapSecurity();

const errors = bootstrapErrors();

const observability = bootstrapObservability();

const metrics = bootstrapMetrics();

const health = bootstrapHealth();

const user = bootstrapUser({
  passwordHasher: security.passwordHasher,
});

const auth = bootstrapAuth({
  userRepository: user.userRepository,

  passwordHasher: security.passwordHasher,

  tokenService: security.tokenService,

  mailer: security.mailer,
});

const view = bootstrapView({
  authService: auth.authService,
});

// -----------------------------
// Register routes
// -----------------------------

function registerRoutes(app) {
  bootstrapRouter({
    app,

    authRouter: auth.authRouter,

    metricsRouter: metrics.metricsRouter,

    healthRouter: health.healthRouter,

    userRouter: user.userRouter,

    viewRouter: view.viewRouter,
  });
}

module.exports = {
  registerRoutes,

  middlewares: {
    ...observability.middlewares,
    ...metrics.middlewares,
  },

  errorMiddlewares: errors,
};
