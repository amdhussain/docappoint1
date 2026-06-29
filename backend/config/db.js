const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connectDB() {
  if (db) {
    console.log('MongoDB already connected');
    return db;
  }

  const MONGO_URI = process.env.MONGO_URI;
  const DB_NAME = process.env.DB_NAME || 'docappoint2';

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  client = new MongoClient(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  await client.connect();
  db = client.db(DB_NAME);
  console.log(`MongoDB connected: ${DB_NAME}`);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB disconnected');
  }
}

module.exports = { connectDB, getDb, closeDB };
