import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser, verifyUserEmail } from '../../controllers/authController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email } = req.body;
      const user = await registerUser(name, email);
      res.status(200).json({ message: 'Verification email sent' });
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      const user = await verifyUserEmail(userId as string);
      res.status(200).json({ message: 'User verified' });
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  } else {
    res.status(405).end();
  }
}
