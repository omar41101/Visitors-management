import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateJWT(req, res, next) {
  let token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token && req.cookies) {
    token = req.cookies.token;
  }
  console.log('Token received:', token);
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('JWT verification error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
}

export function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
}