// app/api/ideas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ideaController } from '@/controllers/ideaController';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const idea = await ideaController.getById(params.id);
  if (idea) {
    return NextResponse.json(idea);
  } else {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { content } = await req.json();
  const updatedIdea = await ideaController.update(params.id, content);
  return NextResponse.json(updatedIdea);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await ideaController.delete(params.id);
  return NextResponse.json({ message: 'Idea deleted successfully' });
}
