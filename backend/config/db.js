// const mongoose = require('mongoose');

// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) return;
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//     });
//     isConnected = true;
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB connection error: ${error.message}`);
//     console.error('Server will start but database features will be unavailable');
//     isConnected = false;
//   }
// };

// const getConnectionStatus = () => isConnected;

// module.exports = connectDB;
// module.exports.getConnectionStatus = getConnectionStatus;




const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error("Server will start but database features will be unavailable");

    isConnected = false;
    throw error; // 🔥 added (important for debugging)
  }
};

// status checker
const getConnectionStatus = () => isConnected;

module.exports = connectDB;
module.exports.getConnectionStatus = getConnectionStatus;