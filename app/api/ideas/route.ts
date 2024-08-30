// app/api/ideas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ideaController } from '@/controllers/ideaController';

export async function GET() {
  const ideas = await ideaController.getAll();
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  const { authorId, content } = await req.json();
  const idea = await ideaController.create(authorId, content);
  return NextResponse.json(idea);
}