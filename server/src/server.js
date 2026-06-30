require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const authRoutes = require('./routes/authRoutes');
const footballRoutes = require('./routes/footballRoutes');

const app = express();

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: false,
    exposedHeaders: ['X-Cache'],
  })
);
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Protect our own routes from abuse.
// The cache absorbs upstream pressure; this absorbs *our* client pressure.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // 2 req/sec/IP — plenty for polling, blocks runaway loops
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, slow down.' },
});
app.use('/api', limiter);

app.get('/api/health', (req, res) =>
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } })
);

app.use('/api/auth', authRoutes);
app.use('/api/football', footballRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`PitchSide server on :${PORT} (${process.env.NODE_ENV || 'development'})`);
  console.log(
    process.env.FOOTBALL_DATA_KEY
      ? '✅ FOOTBALL_DATA_KEY found — using live API'
      : '🟡 No FOOTBALL_DATA_KEY — serving deterministic mock data'
  );
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION', err);
  server.close(() => process.exit(1));
});

module.exports = app;
