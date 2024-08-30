// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { messageController } from '@/controllers/messageController';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId1 = searchParams.get('userId1');
  const userId2 = searchParams.get('userId2');

  if (!userId1 || !userId2) {
    return NextResponse.json({ error: 'Both user IDs are required' }, { status: 400 });
  }

  const messages = await messageController.getConversation(userId1, userId2);
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const { senderId, recipientId, content } = await req.json();
  const message = await messageController.create(senderId, recipientId, content);
  return NextResponse.json(message);
}