// app/api/messages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { messageController } from '@/controllers/messageController';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { content } = await req.json();
  const updatedMessage = await messageController.updateMessage(params.id, content);
  return NextResponse.json(updatedMessage);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await messageController.deleteMessage(params.id);
  return NextResponse.json({ message: 'Message deleted successfully' });
}