// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userController } from '@/controllers/userController';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (query) {
    const users = await userController.searchUsers(query);
    return NextResponse.json(users);
  } else {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  const user = await userController.createUser(email, name);
  return NextResponse.json(user);
}

