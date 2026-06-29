const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDB, getDb, closeDB } = require('./config/db');

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = !origin || /^http:\/\/localhost:\d+$/.test(origin);
      callback(null, allowed);
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/debug', require('./routes/debugRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Contact route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const db = getDb();
    await db.collection('contacts').insertOne({
      name,
      email,
      phone: phone || '',
      message,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5001;

let server;

// MongoDB Connection
connectDB()
  .then(() => {
    console.log('MongoDB Connected Successfully!');

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB Connection Failed:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');
      await closeDB();
      process.exit(0);
    });
  } else {
    await closeDB();
    process.exit(0);
  }
});

process.on('SIGTERM', async () => {
  console.log('\nSIGTERM received, shutting down...');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');
      await closeDB();
      process.exit(0);
    });
  } else {
    await closeDB();
    process.exit(0);
  }
});
