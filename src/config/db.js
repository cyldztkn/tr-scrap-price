import { MongoClient } from "mongodb"; // MongoDB Client'ı import et
import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
  try {
      await mongoose.connect(config.mongodbUri);
      console.log('MongoDB Connected...');
  } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
  }
};

export default connectDB;
