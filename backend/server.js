
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose"); // 🔥 ডাটাবেজ সরাসরি কানেক্ট করার জন্য এটি যুক্ত করা হয়েছে

// // এনভায়রনমেন্ট ভ্যারিয়েবল লোড করুন
// dotenv.config();

// const app = express();

// // middleware
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
// }));

// app.use(express.json());

// // routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/doctors", require("./routes/doctorRoutes"));
// app.use("/api/appointments", require("./routes/appointmentRoutes"));

// // error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.statusCode || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

// // PORT
// const PORT = process.env.PORT || 5000;

// // 💡 বাংলাদেশের ইন্টারনেট ও DNS এরর (querySrv ECONNREFUSED) এড়াতে সরাসরি এখানে স্টেবল লিঙ্ক দেওয়া হলো
// const MONGO_URL = "mongodb://docappoint:Nh8JFtvXxcxt9t1L@cluster0-shard-00-00.9gnhiz4.mongodb.net:27017,cluster0-shard-00-01.9gnhiz4.mongodb.net:27017,cluster0-shard-00-02.9gnhiz4.mongodb.net:27017/test?ssl=true&replicaSet=atlas-khp8d0-shard-0&authSource=admin&retryWrites=true&w=majority";

// // সার্ভার এবং ডাটাবেজ একসাথে চালু করুন
// mongoose.connect(MONGO_URL)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//       console.log("MongoDB Connected Successfully!"); // সফল কানেকশন মেসেজ
//     });
//   })
//   .catch((err) => {
//     console.log("DB Connection Failed:", err.message);
//   });






const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

const app = express();

// Middleware - dynamically allow any localhost origin in development
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
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// Contact route
app.post("/api/contact", (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }

    console.log("Contact form submission:", { name, email, phone, message });

    res.status(200).json({ success: true, message: "Message received" });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Port
const PORT = process.env.PORT || 5001;

let server;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed:", err.message);
  });

// Graceful shutdown — ensures port is released on restart/exit
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
      mongoose.connection.close(false).then(() => process.exit(0));
    });
  } else {
    mongoose.connection.close(false).then(() => process.exit(0));
  }
});

process.on("SIGTERM", () => {
  console.log("\nSIGTERM received, shutting down...");
  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
      mongoose.connection.close(false).then(() => process.exit(0));
    });
  } else {
    mongoose.connection.close(false).then(() => process.exit(0));
  }
});


