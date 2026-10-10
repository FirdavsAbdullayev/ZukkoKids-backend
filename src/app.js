const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { swaggerSpec, swaggerOptions, swaggerUi } = require('./docs/swagger');

const app = express();

// ---- CORS ----
// CLIENT_URL: vergul bilan ajratilgan ro'yxat bo'lishi mumkin.
// Masalan: https://zukkokids.vercel.app,http://localhost:5173
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Brauzerdan bo'lmagan so'rovlar (curl, health-check) origin yubormaydi
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Vercel preview deployment'lari (dinamik domenlar) uchun ruxsat
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
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
