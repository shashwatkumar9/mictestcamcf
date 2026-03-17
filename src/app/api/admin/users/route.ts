import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getAllUsers, createUser, type UserRole } from '@/lib/admin/users';
import { sendVerificationEmail } from '@/lib/admin/email';

// Helper to get current user from request
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// GET - List all users
export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canManageUsers) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  const users = await getAllUsers();
  return NextResponse.json({ users });
}

// POST - Create new user
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canManageUsers) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const { username, email, password, role } = await request.json();

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['admin', 'editor', 'author', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create the user
    const { user, verificationToken } = await createUser({
      username,
      email,
      password,
      role,
    });

    // Send verification email
    await sendVerificationEmail(email, username, verificationToken);

    return NextResponse.json({
      success: true,
      user,
      message: 'User created. Verification email sent.',
    });
  } catch (error) {
    console.error('Create user error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
