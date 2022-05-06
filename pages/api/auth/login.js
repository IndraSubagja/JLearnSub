import { serialize } from 'cookie';

import dbConnect from '../../../utils/dbConnect';
import { generateAccessToken } from '../../../utils/tokenHandler';

import User from '../../../models/user';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'Incorrect username or password provided' });
        user.comparePassword(password, async (error, isMatch) => {
          if (error || !isMatch) return res.status(401).json({ message: 'Incorrect username or password provided' });

          const token = generateAccessToken({ email });

          res.setHeader(
            'Set-Cookie',
            serialize('token', token, {
              path: '/',
              // httpOnly: true,
              // sameSite: true,
              // secure: true,
              maxAge: 60 * 10,
            })
          );

          user.session.login = new Date();
          await user.save();

          res.status(200).json(user.getPublicFields());
        });
      } catch (error) {
        res.status(400).json({ message: 'An error occured' });
      }
      break;
    default:
      res.status(404);
      break;
  }
}
