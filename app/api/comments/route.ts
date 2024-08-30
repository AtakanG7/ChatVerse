// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { commentController } from '@/controllers/commentController';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const ideaId = searchParams.get('ideaId');

  if (!ideaId) {
    return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 });
  }

  const comments = await commentController.getCommentsByIdeaId(ideaId);
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const { authorId, ideaId, content } = await req.json();
  const comment = await commentController.create(authorId, ideaId, content);
  return NextResponse.json(comment);
}