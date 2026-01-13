// src/app.js
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.middleware');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.middleware');

require('./utils/auth'); // passport strategies

const app = express();
app.use(express.json());

// CORS setup
const whitelist = ['http://localhost:8080', 'https://myapp.co'];
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

// Simple root route
app.get('/', (req, res) => res.send('Hola mi server en express'));

// Protected route example
app.get('/nueva-ruta', checkApiKey, (req, res) => res.send('Hola, soy una nueva ruta'));

// Attach domain routes
routerApi(app);

// Error middlewares
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

module.exports = app;
