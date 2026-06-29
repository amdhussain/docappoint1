const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const getMessages = async (req, res) => {
  try {
    const db = getDb();
    const messages = await db.collection('contacts').find().sort({ createdAt: -1 }).toArray();
    console.log('Messages found:', messages.length);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, deleteMessage };
