import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectionController = {
  create: async (userId: string, connectedUserId: string) => {
    return prisma.userConnection.create({
      data: {
        userId,
        connectedUserId,
      },
    })
  },
  getAll: async (userId: string) => {
    return prisma.userConnection.findMany({
      where: { userId },
      include: { user: true, connectedUser: true },
    });
  },
  getById: async (connectionId: string) => {
    return prisma.userConnection.findUnique({
      where: { id: connectionId },
      include: { user: true, connectedUser: true },
    });
  },
  update: async (connectionId: string, connectedUserId: string) => {
    return prisma.userConnection.update({
      where: { id: connectionId },
      data: { connectedUserId },
    });
  },
  delete: async (connectionId: string) => {
    return prisma.userConnection.delete({
      where: { id: connectionId },
    });
  },
};
