const express = require('express');

const passport = require('passport');
const client = require('prom-client');

const UserService = require('../application/user/user.service');
const SequelizeUserRepository = require('../infrastructure/persistence/sequelize/sequelize-user.repository');
const BcryptPasswordHasher = require('../infrastructure/security/bcrypt.password-hasher');
const AuthService = require('../application/auth/auth.service');

const JwtTokenService = require('../infrastructure/security/jwt.token.service');
const NodemailerMailer = require('../infrastructure/mail/node.mailer.mailer');
const configurePassport = require('../infrastructure/auth/passport/passport.factory');
const AuthRouter = require('../infrastructure/http/routes/auth/auth.router');
const authSessionMiddleware = require('../infrastructure/http/middlewares/auth-session.middleware');
const ViewRouter = require('../infrastructure/http/routes/view/view.router');
const WinstonLogger = require('../infrastructure/logger/WinstonLogger');
const createErrorHandlers = require('../infrastructure/http/middlewares/error.middleware');
const createHttpLoggerHandler = require('../infrastructure/http/middlewares/observability/httpLogger.middleware');
const createRequestIdMiddleware = require('../infrastructure/http/middlewares/observability/requestId.middleware');
const UuidRequestIdGenerator = require("../../shared/infrastructure/request-id/uuid-request-id.generator");
const PrometheusMetrics = require("../infrastructure/metrics/prometheus.metrics");
const createMetricsMiddleware = require("../infrastructure/http/middlewares/observability/metrics.middleware");
const MetricsRouter = require("../infrastructure/http/routes/metrics/metrics.router");
const {sequelize} = require("../../database/sequelize");
const DatabaseHealthIndicator = require("../../shared/application/health/db.health-indicator");
const HealthService = require("../../shared/application/health/health.service");
const HealthRouter = require("../infrastructure/http/routes/health/health.router");
const createErrorMapperMiddleware = require("../infrastructure/http/middlewares/error-mapper.middleware");
const {httpErrorMapper} = require("../infrastructure/http/error-mapper");
const UserRouter = require("../infrastructure/http/routes/user/users.router");

const userRepository = new SequelizeUserRepository();
const bcryptPasswordHasher = new BcryptPasswordHasher();
const userService = new UserService({
  userRepository,
  passwordHasher: bcryptPasswordHasher
});

const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService(process.env.JWT_SECRET);
const mailer = new NodemailerMailer({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const authService = new AuthService({
  userRepository,
  passwordHasher,
  tokenService,
  mailer,
});

configurePassport(passport, {
  authService,
  jwtSecret: process.env.JWT_SECRET,
});

const authenticate = passport.authenticate('local', {
  session: false,
});

const authRouter = new AuthRouter({
  authService,
  authenticate,
});

const userRouter = new UserRouter( { userService });


const authMiddleware = authSessionMiddleware(authService);

const viewRouter = new ViewRouter({
  authMiddleware,
});



const logger = new WinstonLogger();

const errorHandlers = createErrorHandlers(logger);
const errorMapperMiddleware = createErrorMapperMiddleware({
  httpErrorMapper,
});

const {
  logErrors,
  ormErrorHandler,
  boomErrorHandler,
  genericErrorHandler,
  notFoundHandler,
} = errorHandlers;

const errorMiddlewares = {
  logErrors,
  ormErrorHandler,
  errorMapperMiddleware, // 👈 comes from separate factory
  boomErrorHandler,
  genericErrorHandler,
  notFoundHandler,
};


const httpLogger = createHttpLoggerHandler(logger);

const requestIdGenerator = new UuidRequestIdGenerator();
const requestId = createRequestIdMiddleware({ requestIdGenerator });


const metrics = new PrometheusMetrics();

const metricsMiddleware = createMetricsMiddleware({ metrics });

const metricsRouter = new MetricsRouter({
  metricsClient: client,
});


const dbIndicator = new DatabaseHealthIndicator({ sequelize });

const healthService = new HealthService({
  indicators: [dbIndicator]
});

const healthRouter = new HealthRouter({
  healthService,
});

const middlewares = {
  requestId: requestId.requestId,
  httpLogger: httpLogger.httpLogger,
  metricsMiddleware: metricsMiddleware.metricsMiddleware,
}

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', userRouter.getRouter());
  router.use('/auth', authRouter.getRouter());

  // Views
  router.use('/', viewRouter.getRouter());

  //Metrics
  router.use('/metrics', metricsRouter.getRouter());

  // Health
  app.use('/health', healthRouter.getRouter());
}

module.exports = {
  routerApi,
  middlewares,
  errorMiddlewares,
};
