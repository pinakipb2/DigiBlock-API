import express from 'express';
import './api/config/env.config';
import cors from 'cors';
import createError from 'http-errors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import DBConnect from './api/config/init_mongodb.config';
import logger from './api/log/logger';

import { AdminRoutes, IssuerRoutes } from './api/routes';

const morgan = require('morgan');

// Connect to DB
DBConnect();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(helmet());
app.set('trust proxy', 1);
app.use(limiter);
app.use(xss());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 😎' });
});

app.use('/api/v1/admin', AdminRoutes);
app.use('/api/v1/issuer', IssuerRoutes);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 @ http://localhost:${PORT}`);
  // logger.info(`Server started running on PORT :${PORT}`);
});
