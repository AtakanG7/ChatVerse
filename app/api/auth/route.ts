import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    const { user, resetToken } = await authController.initiateLoginIfNoSession(email);
    return NextResponse.json({ success: true, user, resetToken });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json({ success: false, error: 'Failed to initiate login' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { email, token } = await request.json();
  try {
    const result = await authController.verifyResetToken(email, token);
    if (result) {
      const { user, jwtToken } = result;
      const response = NextResponse.json({ success: true, user });
      
      response.cookies.set({
        name: 'authToken',
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to verify token' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'No session found' }, { status: 401 });
  }

  try {
    const user = await authController.verifyToken(token);
    if (user) {
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to verify session' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: 'authToken',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}