import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const commentController = {
  create: async (authorId: string, ideaId: string, content: string) => {
    return prisma.comment.create({
      data: {
        authorId,
        ideaId,
        content,
      },
    });
  },

  getCommentsByIdeaId: async (ideaId: string) => {
    return prisma.comment.findMany({
      where: { ideaId },
      include: { author: true },
    });
  },

  update: async (commentId: string, content: string) => {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  },

  delete: async (commentId: string) => {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  },
};