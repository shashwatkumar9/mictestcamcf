'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { SafeUser } from '@/lib/admin/users';

interface UserContextType {
  user: SafeUser | null;
  setUser: (user: SafeUser | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function UserProvider({ children, initialUser }: { children: ReactNode; initialUser?: SafeUser | null }) {
  const [user, setUser] = useState<SafeUser | null>(initialUser || null);

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    setUser(null);
    window.location.href = '/admin/login';
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
