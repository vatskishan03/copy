// backend/src/config/db.ts
import mongoose from 'mongoose';
import env from './env';

async function connectDB() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit with failure if connection fails
  }
}

export default connectDB;
