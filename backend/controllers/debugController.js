const { getDb } = require('../config/db');

const debugDb = async (req, res) => {
  try {
    const db = getDb();
    const results = {};

    // 1. Print currently connected database name
    results.databaseName = db.databaseName;
    console.log('DEBUG: Connected database name:', db.databaseName);

    // 2. List all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    results.collections = collectionNames;
    console.log('DEBUG: Available collections:', collectionNames);

    // 3. Check document count in each collection
    const counts = {};
    for (const name of collectionNames) {
      const count = await db.collection(name).countDocuments();
      counts[name] = count;
      console.log(`DEBUG: Collection "${name}" has ${count} documents`);
    }
    results.counts = counts;

    res.json(results);
  } catch (error) {
    console.error('DEBUG: error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { debugDb };
