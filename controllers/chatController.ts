import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { MessageType } from '@/types/prisma';

const prisma = new PrismaClient();

export const setupSocketServer = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', async (roomIdentifier: string) => {
      socket.join(roomIdentifier);
      console.log(`User joined room: ${roomIdentifier}`);
    });

    socket.on('message', async ({ room, message }: { room: string, message: MessageType }) => {
      await saveMessageToDatabase(message);

      io.to(room).emit('message', message);
      console.log(`Message sent to room ${room}:`, message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};


const saveMessageToDatabase = async (message: MessageType) => {
  try {
    return await prisma.message.create({
      data: {
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    console.error('Error saving message to database:', error);
  }
};


