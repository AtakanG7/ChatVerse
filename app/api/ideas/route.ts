// app/api/ideas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ideaController } from '@/controllers/ideaController';
import { userController } from '@/controllers/userController';

export async function GET() {
  const ideas = await ideaController.getAll();
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  try{
    const { authorId, content } = await req.json();
    const user = await userController.getUserById(authorId);
    const idea = await ideaController.create(authorId, content);
    return NextResponse.json({...idea, author: user});
  }catch(error){
    console.error('Error creating idea:', error);    
  }
}
