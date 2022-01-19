const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config({ path: './.env.development' });
require('./api/config/init_mongodb.config');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 😎' });
});

app.use('/api/v1/admin', require('./api/routes/Admin.route'));
app.use('/api/v1/issuer', require('./api/routes/Issuer.route'));

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
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
