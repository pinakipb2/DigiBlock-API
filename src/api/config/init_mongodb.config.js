const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.ADMIN_DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Mongodb Connected');
}).catch((err) => {
  console.log(err.message);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose Connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose Connection is Disconnected');
});
