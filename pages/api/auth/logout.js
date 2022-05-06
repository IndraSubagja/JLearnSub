import { serialize } from 'cookie';

import dbConnect from '../../../utils/dbConnect';
import { authenticateUser } from '../../../utils/tokenHandler';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        if (req.cookies.token) {
          const user = await authenticateUser(req.cookies.token);

          if (user) {
            user.session.logout = new Date();
            await user.save();
          }

          res.setHeader('Set-Cookie', serialize('token', '', { path: '/', maxAge: -1 }));
        }

        res.status(200).json({ mesage: 'Logout successfully' });
      } catch (error) {
        res.status(400).json({ message: 'An error occured' });
      }
      break;
    default:
      res.status(404);
      break;
  }
}
