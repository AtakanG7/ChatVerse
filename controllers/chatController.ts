import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setupSocketServer = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

export const userConnectionController = {
  create: async (userId: string, connectedUserId: string) => {
    return prisma.userConnection.create({
      data: {
        userId,
        connectedUserId,
      },
    });
  },

  getConnections: async (userId: string) => {
    return prisma.userConnection.findMany({
      where: { userId },
      include: { connectedUser: true },
    });
  },

  deleteConnection: async (userId: string, connectedUserId: string) => {
    return prisma.userConnection.deleteMany({
      where: {
        OR: [
          { userId, connectedUserId },
          { userId: connectedUserId, connectedUserId: userId },
        ],
      },
    });
  },
};