// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { userController } from '@/controllers/userController';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await userController.getUserById(params.id);
  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updatedUser = await userController.updateUser(params.id, data);
  return NextResponse.json(updatedUser);
}