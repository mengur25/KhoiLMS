import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khoi_lms';

  try {
    // Attempt connecting to provided MONGODB_URI with a 2.5s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ Connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to local/remote MongoDB (${err.message}).`);
    console.log('🔄 Initializing in-memory MongoDB (MongoMemoryServer) for zero-config local operation...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Connected to in-memory MongoDB instance at: ${memoryUri}`);
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
};
