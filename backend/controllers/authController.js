// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, photo } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Please provide name, email and password' });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters long' });
//     }
//     if (!/[A-Z]/.test(password)) {
//       return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
//     }
//     if (!/[a-z]/.test(password)) {
//       return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
//     }

//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       name,
//       email: email.toLowerCase(),
//       password,
//       photo: photo || '',
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       photo: user.photo,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Please provide email and password' });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       photo: user.photo,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (req.body.name) user.name = req.body.name;
//     if (req.body.photo !== undefined) user.photo = req.body.photo;

//     const updated = await user.save();
//     res.json({
//       _id: updated._id,
//       name: updated.name,
//       email: updated.email,
//       photo: updated.photo,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { registerUser, loginUser, getMe, updateProfile };




// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, photo } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         message: 'Please provide name, email and password',
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         message: 'Password must be at least 6 characters long',
//       });
//     }

//     if (!/[A-Z]/.test(password)) {
//       return res.status(400).json({
//         message: 'Password must contain at least one uppercase letter',
//       });
//     }

//     if (!/[a-z]/.test(password)) {
//       return res.status(400).json({
//         message: 'Password must contain at least one lowercase letter',
//       });
//     }

//     const existingUser = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: 'User already exists',
//       });
//     }

//     const user = await User.create({
//       name,
//       email: email.toLowerCase(),
//       password,
//       photo: photo || '',
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       photo: user.photo,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     console.error('REGISTER ERROR:', error);
//     res.status(500).json({
//       message: error.message,
//       stack: error.stack,
//     });
//   }
// };

// module.exports = {
//   registerUser,
// };






const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { name, email, password, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter',
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least one lowercase letter',
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      photo: photo || '',
    });

    console.log("USER CREATED:", user);

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token,
    });
  } catch (error) {
    console.error("========== REGISTER ERROR ==========");
    console.error(error);
    console.error("===================================");

    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.photo !== undefined) user.photo = req.body.photo;

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      photo: updated.photo,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};