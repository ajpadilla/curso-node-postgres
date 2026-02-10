// src/app.js
const express = require('express');
const cors = require('cors');
const {
  routerApi,
  errorHandlers,
  requestId,
  httpLogger,
  metricsMiddleware
}
  = require('./ecommerce/bootstrap/container');
const { join } = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

const { logErrors, ormErrorHandler, boomErrorHandler, genericErrorHandler, notFoundHandler } =
  errorHandlers;

function buildApp() {
  const app = express();

  // Views config
  app.set('view engine', 'ejs');
  app.set('views', join(__dirname, 'views'));
  app.use('/js', express.static(join(__dirname, 'frontend/js')));
  app.use('/css', express.static(join(__dirname, 'frontend/css')));

  // Layouts
  app.use(expressLayouts);
  app.set('layout', 'layouts/app');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://myapp.co'];

  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('no permitido'));
      }
    },
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());

  routerApi(app);

  app.use(logErrors);
  app.use(requestId.requestId);
  app.use(metricsMiddleware.metricsMiddleware);
  app.use(httpLogger.httpLogger);
  app.use(ormErrorHandler);
  app.use(boomErrorHandler);
  app.use(genericErrorHandler);
  app.use(notFoundHandler);

  return app;
}

module.exports = buildApp;
