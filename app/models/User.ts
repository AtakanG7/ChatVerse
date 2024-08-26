import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/db';

export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

export const createUser = async (name: string, email: string): Promise<User> => {
  return prisma.user.create({
    data: {
      id: uuidv4(),
      name,
      email,
      verified: false,
    },
  });
};

export const verifyUser = async (userId: string): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { verified: true },
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};