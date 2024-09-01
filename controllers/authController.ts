import { PrismaClient, User } from '@prisma/client';
import { sendVerificationCode } from '../app/lib/email';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'never-look-at-this-secret';

export const authController = {
  initiateLoginIfNoSession: async (email: string): Promise<{ user: User; resetToken: string }> => {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0], 
          verified: false,
        },
      });
    }

    const resetToken = uuidv4().slice(0, 6);
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    await sendVerificationCode(user.email, resetToken);

    return { user, resetToken };
  },

  verifyResetToken: async (email: string, token: string): Promise<{ user: User; jwtToken: string } | null> => {
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return null;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    const jwtToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    return { user, jwtToken };
  },

  logout: async (userId: string): Promise<void> => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetToken: null,
        resetTokenExpires: null,
      },
    });
  },

  verifyToken: async (token: string): Promise<User | null> => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      const user = await prisma.user.findUnique({ where: { email: decoded.email } });
      return user;
    } catch (error) {
      return null;
    }
  },
};