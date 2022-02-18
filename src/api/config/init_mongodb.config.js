import mongoose from 'mongoose';

const DBConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    })
    .then(() => {
      console.log('Mongodb Connected 🤝🔌');
    })
    .catch((err) => {
      console.log(err.message);
    });

  mongoose.connection.on('connected', () => {
    console.log('Mongoose Connected to DB 👌');
  });

  mongoose.connection.on('error', (err) => {
    console.log(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose Connection is Disconnected 🔴');
  });
};

export default DBConnect;
