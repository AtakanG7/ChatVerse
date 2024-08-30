import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likeController = {
  create: async (userId: string, ideaId: string) => {
    return prisma.like.create({
      data: {
        userId,
        ideaId,
      },
    });
  },

  getLikesByIdeaId: async (ideaId: string) => {
    return prisma.like.findMany({
      where: { ideaId },
      include: { user: true },
    });
  },

  delete: async (userId: string, ideaId: string) => {
    return prisma.like.deleteMany({
      where: {
        userId,
        ideaId,
      },
    });
  },

  isLiked: async (userId: string, ideaId: string) => {
    const like = await prisma.like.findFirst({
      where: {
        userId,
        ideaId,
      },
    });
    return !!like;
  },
};