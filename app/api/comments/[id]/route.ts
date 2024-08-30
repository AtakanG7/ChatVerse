// app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { commentController } from '@/controllers/commentController';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { content } = await req.json();
  const updatedComment = await commentController.update(params.id, content);
  return NextResponse.json(updatedComment);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await commentController.delete(params.id);
  return NextResponse.json({ message: 'Comment deleted successfully' });
}
