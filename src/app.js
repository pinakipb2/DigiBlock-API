import express from 'express';
import './api_v1/config/env.config';
import cors from 'cors';
import createError from 'http-errors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import DBConnect from './api_v1/config/init_mongodb.config';
import { infoLogger } from './api_v1/log/logger';

import { AdminRoutes, IssuerRoutes } from './api_v1/routes';

const morgan = require('morgan');

// Connect to DB
DBConnect();

// RateLimitter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const corsOption = {
  origin: ['http://localhost:3000'],
};

const app = express();
app.use(helmet());
app.set('trust proxy', 1);
app.use(limiter);
app.use(xss());
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Welcome Route
app.all('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 😎' });
});

// Admin Routes
app.use('/api/v1/admin', AdminRoutes);
// Issuer Routes
app.use('/api/v1/issuer', IssuerRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

// Server Configs
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 @ http://localhost:${PORT}`);
  infoLogger.info(`Server started running on PORT :${PORT}`);
});
