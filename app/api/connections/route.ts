// app/api/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userConnectionController } from '@/controllers/chatController';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const connectedUsers = await userConnectionController.getConnections(userId);
  return NextResponse.json(connectedUsers);
}

export async function POST(req: NextRequest) {
  const { userId, connectedUserId } = await req.json();
  const connection = await userConnectionController.create(userId, connectedUserId);
  return NextResponse.json(connection);
}

export async function DELETE(req: NextRequest) {
  const { userId, connectedUserId } = await req.json();
  await userConnectionController.deleteConnection(userId, connectedUserId);
  return NextResponse.json({ message: 'Connection deleted successfully' });
}