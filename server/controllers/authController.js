import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const authController = {
  register: async (req, res) => {
    const { username, email, password, role, department } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
      const user = new User({ username, email, password, role, department });
      await user.save();
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const accessToken = jwt.sign(
        { id: user._id, role: user.role, department: user.department },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required.' });
    }
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token.' });
      }
      const accessToken = jwt.sign(
        { id: user._id, role: user.role, department: user.department },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token.' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.status(200).json({ message: 'Logged out successfully.' });
  }
};

export default authController;