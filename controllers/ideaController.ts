import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ideaController = {
  create: async (authorId: string, content: string) => {
    return prisma.idea.create({
      data: {
        authorId,
        content,
      },
    });
  },

  getAll: async () => {
    return prisma.idea.findMany({
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    });
  },

  getById: async (ideaId: string) => {
    return prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    });
  },

  update: async (ideaId: string, content: string) => {
    return prisma.idea.update({
      where: { id: ideaId },
      data: { content },
    });
  },

  delete: async (ideaId: string) => {
    return prisma.idea.delete({
      where: { id: ideaId },
    });
  },
};