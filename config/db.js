const mongoose = require('mongoose');
const config = require('config');
require('dotenv').config();

const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB connected.');
  } catch (e) {
    console.error('MongoDB not connected.');
    console.error(e.message);
    process.exit(1);
  }
}

module.exports = connectDB;
