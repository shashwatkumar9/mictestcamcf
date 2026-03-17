import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById, updateUser, deleteUser, toSafeUser } from '@/lib/admin/users';

// Helper to get current user from request
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single user
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canManageUsers && currentUser.id !== id) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  const user = await getUserById(id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: toSafeUser(user) });
}

// PATCH - Update user
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canManageUsers) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const allowedFields = ['username', 'email', 'role', 'isActive'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const user = await updateUser(id, updateData);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update user';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canManageUsers) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const success = await deleteUser(id);

    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
