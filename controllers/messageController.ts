import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const messageController = {
  create: async (senderId: string, recipientId: string, content: string) => {
    return prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
      },
    });
  },

  getConversation: async (userId1: string, userId2: string) => {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, recipientId: userId2 },
          { senderId: userId2, recipientId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  updateMessage: async (messageId: string, content: string) => {
    return prisma.message.update({
      where: { id: messageId },
      data: { content },
    });
  },

  deleteMessage: async (messageId: string) => {
    return prisma.message.delete({
      where: { id: messageId },
    });
  },
};