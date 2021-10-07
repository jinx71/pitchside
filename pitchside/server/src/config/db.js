const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Don't crash in dev — mock data still works without Mongo.
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
};

module.exports = connectDB;
