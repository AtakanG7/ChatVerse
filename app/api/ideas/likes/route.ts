// app/api/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { likeController } from '@/controllers/likeController';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const ideaId = searchParams.get('ideaId');

  if (!ideaId) {
    return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 });
  }

  try {
    const likes = await likeController.getLikesByIdeaId(ideaId);
    return NextResponse.json(likes);
  } catch (error) {
    console.error('Error getting likes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, ideaId } = await req.json();
    const like = await likeController.create(userId, ideaId);
    return NextResponse.json(like);
  } catch (error) {
    console.error('Error creating like:', error);

    if (error instanceof Error && error.message === 'This like already exists') {
      return NextResponse.json({ error: 'This like already exists', code: 409 }, { status: 409 });
    }

    if (error.code === 'P2002' && error.meta?.modelName === 'Like' && error.meta?.target === 'Like_userId_ideaId_key') {
      return NextResponse.json({ error: 'This like already exists', code: 409 }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, ideaId } = await req.json();
    await likeController.delete(userId, ideaId);
    return NextResponse.json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

