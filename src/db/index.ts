import mongoose from 'mongoose';
import { Mongoose } from 'mongoose'; 
import config from '../config'; 

const connectDB = async (): Promise<void> => {
  try {
    const dbHost = config.get('db.host');
    const dbName = config.get('db.name');
    const conn: Mongoose = await mongoose.connect(`mongodb://${dbHost}/${dbName}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

export default connectDB;