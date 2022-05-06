import { serialize } from 'cookie';

import dbConnect from '../../../utils/dbConnect';
import { authenticateToken, generateAccessToken } from '../../../utils/tokenHandler';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        if (req.cookies.token) {
          const { email } = authenticateToken(req.cookies.token);
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
        }

        res.status(200).send('Token refreshed');
      } catch (error) {
        res.status(400).json({ message: 'An error occured' });
      }
      break;
    default:
      res.status(404);
      break;
  }
}
