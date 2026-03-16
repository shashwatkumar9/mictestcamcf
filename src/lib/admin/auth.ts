import {
  getUserByUsernameOrEmail,
  verifyPassword,
  generateToken,
  verifyToken,
  updateLastLogin,
  toSafeUser,
  type SafeUser,
  type AdminUser,
} from './users';

export type { SafeUser as AdminUser } from './users';

export async function authenticateUser(
  identifier: string,
  password: string
): Promise<{ success: boolean; user?: SafeUser; token?: string; error?: string }> {
  const user = await getUserByUsernameOrEmail(identifier);

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValidPassword = await verifyPassword(user.email, password);
  if (!isValidPassword) {
    return { success: false, error: 'Invalid credentials' };
  }

  if (!user.isEmailVerified) {
    return { success: false, error: 'Please verify your email before logging in' };
  }

  await updateLastLogin(user.id);
  const token = generateToken(user);

  return {
    success: true,
    user: toSafeUser(user),
    token,
  };
}

export async function verifyAuthToken(token: string): Promise<SafeUser | null> {
  return await verifyToken(token);
}

// Re-export commonly used functions
export { generateToken, verifyToken } from './users';
