// app/api/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { likeController } from '@/controllers/likeController';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const ideaId = searchParams.get('ideaId');

  if (!ideaId) {
    return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 });
  }

  const likes = await likeController.getLikesByIdeaId(ideaId);
  return NextResponse.json(likes);
}

export async function POST(req: NextRequest) {
  const { userId, ideaId } = await req.json();
  const like = await likeController.create(userId, ideaId);
  return NextResponse.json(like);
}

export async function DELETE(req: NextRequest) {
  const { userId, ideaId } = await req.json();
  await likeController.delete(userId, ideaId);
  return NextResponse.json({ message: 'Like removed successfully' });
}