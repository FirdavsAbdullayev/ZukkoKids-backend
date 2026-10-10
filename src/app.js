const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { swaggerSpec, swaggerOptions, swaggerUi } = require('./docs/swagger');

const app = express();

// ---- Global Middleware ----
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// Request logger (oddiy)
app.use((req, _res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  next();
});

// ---- Swagger Docs ----
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// ---- API Routes ----
app.use('/api', routes);

// ---- 404 & Error Handler ----
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
