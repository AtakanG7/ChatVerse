import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const userController = {
  createUser: async (email: string, name: string): Promise<User> => {
    return prisma.user.create({
      data: {
        email,
        name,
        verified: false,
      },
    });
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  getUserById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  searchUsers: async (query: string): Promise<User[]> => {
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  },

  getUserConnections: async (userId: string) => {
    return prisma.userConnection.findMany({
      where: { userId },
      include: { connectedUser: true },
    });
  },

  createUserConnection: async (userId: string, connectedUserId: string) => {
    return prisma.userConnection.create({
      data: {
        userId,
        connectedUserId,
      },
    });
  },

  verifyUser: async (userId: string): Promise<User> => {
    return prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    });
  },
};