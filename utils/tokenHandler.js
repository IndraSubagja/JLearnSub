import jwt from 'jsonwebtoken';
import User from '../models/user';

export function generateAccessToken(email) {
  return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '10m' });
}

export function authenticateToken(token) {
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

export async function authenticateUser(token) {
  const { email } = authenticateToken(token);
  const user = await User.findOne({ email });
  return user;
}
