const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
    }

    const db = getDb();
    const users = db.collection('users');

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      photo: photo || '',
      createdAt: new Date(),
    });

    const token = generateToken(result.insertedId.toString());

    res.status(201).json({
      _id: result.insertedId,
      name,
      email: email.toLowerCase(),
      photo: photo || '',
      token,
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const db = getDb();
    const users = db.collection('users');

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const db = getDb();
    const users = db.collection('users');

    const user = await users.findOne(
      { _id: new ObjectId(req.user._id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const db = getDb();
    const users = db.collection('users');

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.photo !== undefined) updateData.photo = req.body.photo;

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(req.user._id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
