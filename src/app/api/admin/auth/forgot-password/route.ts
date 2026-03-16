export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { generatePasswordResetToken, getUserByEmail } from '@/lib/admin/users';
import { sendPasswordResetEmail } from '@/lib/admin/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    const user = await getUserByEmail(email);

    if (user) {
      const token = await generatePasswordResetToken(email);
      if (token) {
        await sendPasswordResetEmail(email, user.username, token);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
