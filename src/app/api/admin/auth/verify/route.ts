export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin/users';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
