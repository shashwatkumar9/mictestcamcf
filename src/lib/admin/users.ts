
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, users } from '@/lib/db';
import { eq, or } from 'drizzle-orm';

// User roles
export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface UserPermissions {
  canCreatePosts: boolean;
  canEditPosts: boolean;
  canEditOwnPosts: boolean;
  canDeletePosts: boolean;
  canPublishPosts: boolean;
  canManageUsers: boolean;
  canViewDashboard: boolean;
}

// Role permissions mapping
export const rolePermissions: Record<UserRole, UserPermissions> = {
  admin: {
    canCreatePosts: true,
    canEditPosts: true,
    canEditOwnPosts: true,
    canDeletePosts: true,
    canPublishPosts: true,
    canManageUsers: true,
    canViewDashboard: true,
  },
  editor: {
    canCreatePosts: true,
    canEditPosts: true,
    canEditOwnPosts: true,
    canDeletePosts: true,
    canPublishPosts: true,
    canManageUsers: false,
    canViewDashboard: true,
  },
  author: {
    canCreatePosts: true,
    canEditPosts: false,
    canEditOwnPosts: true,
    canDeletePosts: false,
    canPublishPosts: false,
    canManageUsers: false,
    canViewDashboard: true,
  },
  viewer: {
    canCreatePosts: false,
    canEditPosts: false,
    canEditOwnPosts: false,
    canDeletePosts: false,
    canPublishPosts: false,
    canManageUsers: false,
    canViewDashboard: true,
  },
};

// Role display names
export const roleDisplayNames: Record<UserRole, string> = {
  admin: 'Administrator',
  editor: 'Editor (Full Access)',
  author: 'Author (Create Only)',
  viewer: 'Viewer (Read Only)',
};

// Role descriptions
export const roleDescriptions: Record<UserRole, string> = {
  admin: 'Full access to all features including user management',
  editor: 'Can create, edit, delete, and publish all blog posts',
  author: 'Can create and edit own posts, but cannot publish',
  viewer: 'Read-only access to the dashboard',
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable must be set');
  }
  return secret;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerificationExpires: Date | null;
  passwordResetExpires: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  permissions: UserPermissions;
}

function rowToAdminUser(row: typeof users.$inferSelect): AdminUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role as UserRole,
    isEmailVerified: row.isEmailVerified,
    emailVerificationToken: row.emailVerificationToken ?? null,
    emailVerificationExpires: row.emailVerificationExpires ? new Date(row.emailVerificationExpires) : null,
    passwordResetToken: row.passwordResetToken ?? null,
    passwordResetExpires: row.passwordResetExpires ? new Date(row.passwordResetExpires) : null,
    lastLogin: row.lastLogin ? new Date(row.lastLogin) : null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// Get all users
export async function getAllUsers(): Promise<SafeUser[]> {
  const db = getDb();
  const rows = await db.select().from(users);

  return rows.map(row => {
    const adminUser = rowToAdminUser(row);
    return {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      isEmailVerified: adminUser.isEmailVerified,
      emailVerificationExpires: adminUser.emailVerificationExpires,
      passwordResetExpires: adminUser.passwordResetExpires,
      lastLoginAt: adminUser.lastLogin,
      createdAt: adminUser.createdAt,
      updatedAt: adminUser.updatedAt,
      isActive: row.isActive,
      permissions: rolePermissions[adminUser.role] || rolePermissions.viewer,
    } as SafeUser;
  });
}

// Get user by ID
export async function getUserById(id: string): Promise<AdminUser | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return null;
  return rowToAdminUser(row);
}

// Get user by email
export async function getUserByEmail(email: string): Promise<AdminUser | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return null;
  return rowToAdminUser(row);
}

// Get user by username
export async function getUserByUsername(username: string): Promise<AdminUser | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return null;
  return rowToAdminUser(row);
}

// Create new user
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor';
}): Promise<{ user: SafeUser; verificationToken: string }> {
  const db = getDb();
  const passwordHash = bcrypt.hashSync(data.password, 12);
  const verificationToken = uuidv4();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const now = new Date().toISOString();

  const result = await db
    .insert(users)
    .values({
      id: uuidv4(),
      username: data.username,
      email: data.email,
      passwordHash,
      role: data.role || 'editor',
      isActive: true,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires.toISOString(),
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLogin: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const adminUser = rowToAdminUser(result[0]);
  return {
    user: toSafeUser(adminUser),
    verificationToken,
  };
}

// Update user
export async function updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser | null> {
  try {
    const db = getDb();
    const updateValues: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (data.username !== undefined) updateValues.username = data.username;
    if (data.email !== undefined) updateValues.email = data.email;
    if (data.passwordHash !== undefined) updateValues.passwordHash = data.passwordHash;
    if (data.role !== undefined) updateValues.role = data.role;
    if (data.isEmailVerified !== undefined) updateValues.isEmailVerified = data.isEmailVerified;
    if (data.emailVerificationToken !== undefined) updateValues.emailVerificationToken = data.emailVerificationToken;
    if (data.emailVerificationExpires !== undefined) {
      updateValues.emailVerificationExpires = data.emailVerificationExpires
        ? data.emailVerificationExpires.toISOString()
        : null;
    }
    if (data.passwordResetToken !== undefined) updateValues.passwordResetToken = data.passwordResetToken;
    if (data.passwordResetExpires !== undefined) {
      updateValues.passwordResetExpires = data.passwordResetExpires
        ? data.passwordResetExpires.toISOString()
        : null;
    }
    if (data.lastLogin !== undefined) {
      updateValues.lastLogin = data.lastLogin ? data.lastLogin.toISOString() : null;
    }

    const result = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.id, id))
      .returning();

    const row = result[0] ?? null;
    if (!row) return null;
    return rowToAdminUser(row);
  } catch {
    return null;
  }
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const db = getDb();
    await db.delete(users).where(eq(users.id, id));
    return true;
  } catch {
    return false;
  }
}

// Verify password
export async function verifyPassword(email: string, password: string): Promise<AdminUser | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) return null;

  // Update last login
  await updateUser(user.id, {
    lastLogin: new Date(),
  });

  return user;
}

// Set email verification token
export async function setEmailVerificationToken(userId: string): Promise<string> {
  const token = uuidv4();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await updateUser(userId, {
    emailVerificationToken: token,
    emailVerificationExpires: expires,
  });

  return token;
}

// Verify email with token
export async function verifyEmail(token: string): Promise<boolean> {
  const db = getDb();
  const now = new Date().toISOString();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.emailVerificationToken, token))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return false;

  // Check expiry manually (ISO string comparison works lexicographically)
  if (!row.emailVerificationExpires || row.emailVerificationExpires <= now) return false;

  await updateUser(row.id, {
    isEmailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
  });

  return true;
}

// Set password reset token
export async function setPasswordResetToken(email: string): Promise<string | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const token = uuidv4();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await updateUser(user.id, {
    passwordResetToken: token,
    passwordResetExpires: expires,
  });

  return token;
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const db = getDb();
  const now = new Date().toISOString();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.passwordResetToken, token))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return false;

  // Check expiry manually
  if (!row.passwordResetExpires || row.passwordResetExpires <= now) return false;

  const passwordHash = bcrypt.hashSync(newPassword, 12);

  await updateUser(row.id, {
    passwordHash,
    passwordResetToken: null,
    passwordResetExpires: null,
  });

  return true;
}

// Initialize default admin (run this once)
export async function initializeDefaultAdmin(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL and ADMIN_PASSWORD env vars required to initialize default admin. Skipping.');
    return;
  }

  const existingAdmin = await getUserByEmail(adminEmail);
  if (existingAdmin) return;

  await createUser({
    username: adminUsername,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  const admin = await getUserByEmail(adminEmail);
  if (admin) {
    await updateUser(admin.id, {
      isEmailVerified: true,
    });
  }
}

// Safe user converter (removes sensitive fields)
export function toSafeUser(user: AdminUser): SafeUser {
  const { passwordHash, passwordResetToken, emailVerificationToken, lastLogin, ...rest } = user;
  return {
    ...rest,
    lastLoginAt: lastLogin,
    isActive: true,
    permissions: rolePermissions[user.role as UserRole] || rolePermissions.viewer,
  };
}

// Get user by username or email
export async function getUserByUsernameOrEmail(identifier: string): Promise<AdminUser | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(users)
    .where(or(eq(users.username, identifier), eq(users.email, identifier)))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return null;
  return rowToAdminUser(row);
}

// Update last login
export async function updateLastLogin(id: string): Promise<void> {
  await updateUser(id, {
    lastLogin: new Date(),
  });
}

// Generate password reset token (alias for backward compatibility)
export async function generatePasswordResetToken(email: string): Promise<string | null> {
  return await setPasswordResetToken(email);
}

// Generate JWT token
export function generateToken(user: AdminUser): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SafeUser | null> {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
    const user = await getUserById(decoded.id);
    if (!user) return null;
    return toSafeUser(user);
  } catch {
    return null;
  }
}
