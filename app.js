// src/app.js
const express = require('express');
const cors = require('cors');
const { join } = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

const { routerApi, middlewares, errorMiddlewares } = require('./ecommerce/bootstrap/container');

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

  // 1️⃣ Normal middlewares (run for every request)
  app.use(middlewares.requestId);
  app.use(middlewares.metricsMiddleware);
  app.use(middlewares.httpLogger);

  // 2️⃣ Routes
  routerApi(app);

  // 2️⃣ 404 (only if NO route matched)
  app.use(errorMiddlewares.notFoundHandler);

  // 3️⃣ Error middlewares (ONLY for errors)
  app.use(errorMiddlewares.logErrors);
  app.use(errorMiddlewares.ormErrorHandler);
  app.use(errorMiddlewares.errorMapperMiddleware);
  app.use(errorMiddlewares.boomErrorHandler);
  app.use(errorMiddlewares.genericErrorHandler);

  return app;
}

module.exports = buildApp;
