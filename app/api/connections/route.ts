// app/api/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectionController } from '@/controllers/connectionController';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const connectedUserObjects = await connectionController.getAll(userId);
  type Connection = {
    user: {
      id: string;
      name: string;
      email: string;
      verified: boolean;
      createdAt: Date;
      updatedAt: Date;
      resetToken: string | null;
      resetTokenExpires: Date | null;
    };
    connectedUser: {
      id: string;
      name: string;
      email: string;
      verified: boolean;
      createdAt: Date;
      updatedAt: Date;
      resetToken: string | null;
      resetTokenExpires: Date | null;
    };
  } & {
    [key: string]: any;
  };

  const users = connectedUserObjects.map((connection: Connection) => connection.connectedUser);
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const { userId, connectedUserId } = await req.json();
    if (!userId || !connectedUserId) {
      return NextResponse.json({ error: 'User ID and connectedUserId are required' }, { status: 400 });
    }
    const connection = await connectionController.create(userId, connectedUserId);
    return NextResponse.json(connection);
  } catch (error) {
    console.error('Error creating connection:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'This connection already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, connectedUserId } = await req.json();
  await connectionController.delete(userId);
  return NextResponse.json({ message: 'Connection deleted successfully' });
}
