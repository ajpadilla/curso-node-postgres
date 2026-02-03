// src/app.js
const express = require('express');
const cors = require('cors');
const routerApi = require('./ecommerce/bootstrap/container');
const { checkApiKey } = require('./ecommerce/infrastructure/http/middlewares/auth.middleware');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./ecommerce/infrastructure/http/middlewares/error.middleware');
const {join} = require("path");
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require("cookie-parser");


function buildApp() {
  const app = express();

  // Views config
  app.set('view engine', 'ejs');
  app.set('views', join(__dirname, 'views'));
  app.use('/js', express.static(join(__dirname, 'frontend/js')));

  // Layouts
  app.use(expressLayouts);
  app.set('layout', 'layouts/app');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const whitelist = [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://myapp.co'
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('no permitido'));
      }
    }
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.get('/', (req, res) => res.send('Hola mi server en express'));

  app.get('/nueva-ruta', checkApiKey, (req, res) =>
    res.send('Hola, soy una nueva ruta')
  );

  routerApi(app);

  app.use(logErrors);
  app.use(ormErrorHandler);
  app.use(boomErrorHandler);
  app.use(errorHandler);

  return app;
}

module.exports = buildApp;
