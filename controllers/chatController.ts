import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { MessageType } from '@/types/prisma';

const prisma = new PrismaClient();

export const setupSocketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: (origin: string | undefined, callback) => {
        const allowedOrigins = [
          `http://${server.address().address}:${server.address().port}`,
          `https://${server.address().address}:${server.address().port}`,
          'https://chat.atakangul.com', 
          'http://localhost:3000',
        ];

        if (allowedOrigins.includes(origin ?? '') || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  }).on('error', (err) => console.error('Socket.IO error:', err));

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


