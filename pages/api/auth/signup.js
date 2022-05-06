import { serialize } from 'cookie';

import dbConnect from '../../../utils/dbConnect';
import { generateAccessToken } from '../../../utils/tokenHandler';

import User from '../../../models/user';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { username, email, password, firstName, lastName } = req.body;
        const existedUser = await User.findOne({ email });

        if (existedUser) return res.status(401).json({ message: 'Email already taken' });

        const newUser = new User({ username, email, password, firstName, lastName, session: { login: new Date() } });
        await newUser.save();

        const token = generateAccessToken({ email });

        res.setHeader(
          'Set-Cookie',
          serialize('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: true,
            secure: true,
            maxAge: 60 * 10,
          })
        );

        res.status(200).json(newUser.getPublicFields());
      } catch (error) {
        res.status(400).json({ message: 'An error occured' });
      }
      break;
    default:
      res.status(404);
      break;
  }
}
