import  User from '../module/userModel.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stage from '../module/stageModule.js';


export const register = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const userRole = role && ['user', 'admin'].includes(role) ? role : 'user';
    const hash = bcrypt.hashSync(password, 10); // you don’t even need genSaltSync separately

    const newUser = new User({
      username,
      email,
      password: hash,
      role: userRole,
    });

    await newUser.save();
    res.status(200).json("User has been created");
  } catch (error) {
    console.log(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error registering the user" });
  }
};


export const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username in MongoDB
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = bcrypt.compareSync(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Send the response with the token and user information
      res.json({ token, role: user.role, username: user.username });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Login failed', error: err });
    }
  };

// Get user's last searched stage
export const getLastSearchedStage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('lastSearchedStage');
    if (!user || !user.lastSearchedStage) {
      return res.status(404).json({ message: 'No recent stage found' });
    }
    res.json(user.lastSearchedStage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const setLastSearchedStage = async (req, res) => {
  try {
    const { stageId } = req.body;
    if (!stageId) return res.status(400).json({ message: 'stageId is required' });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { lastSearchedStage: stageId },
      { new: true }
    ).populate('lastSearchedStage');
    res.json({ message: 'Last searched stage updated', lastSearchedStage: user.lastSearchedStage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Request password reset (no email, just check if user exists)
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    // Always return success to avoid user enumeration
    return res.status(200).json({ message: 'If an account with that email exists, you can reset your password.' });
};

// Reset password (no token, just email and new password)
export const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        // Always return success to avoid user enumeration
        return res.status(200).json({ message: 'Password reset successful' });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    user.password = hash;
    await user.save();
    return res.status(200).json({ message: 'Password reset successful' });
};