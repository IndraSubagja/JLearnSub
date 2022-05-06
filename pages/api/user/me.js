import dbConnect from '../../../utils/dbConnect';
import { authenticateUser } from '../../../utils/tokenHandler';

export default async function handler(req, res) {
  await dbConnect();

  if (!req.cookies.token) return res.status(400).json({ user: false, message: 'Unauthenticated user' });
  const user = await authenticateUser(req.cookies.token);
  if (!user) return res.status(400).json({ user: false, message: 'Unauthenticated user' });

  switch (req.method) {
    case 'GET':
      try {
        res.status(200).json(user.getPublicFields());
      } catch (error) {
        res.status(400).json({ message: 'An error occured' });
      }
      break;
    default:
      res.status(404);
      break;
  }
}
