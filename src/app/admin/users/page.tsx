'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { roleDisplayNames, type SafeUser } from '@/lib/admin/users';

export default function UsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  return (
    <AdminAuthGuard requireAdmin>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-400">Manage admin users and their roles</p>
            </div>
            <Link
              href="/admin/users/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-white mb-2">No users found</h2>
              <p className="text-gray-400 mb-6">Get started by adding your first user</p>
              <Link
                href="/admin/users/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </Link>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Last Login</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.username}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400'
                            : user.role === 'editor'
                            ? 'bg-blue-500/20 text-blue-400'
                            : user.role === 'author'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {roleDisplayNames[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <>
                              {user.isEmailVerified ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                  Pending Verification
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              Disabled
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`p-2 rounded-lg transition ${
                              user.isActive
                                ? 'text-yellow-400 hover:bg-yellow-500/10'
                                : 'text-green-400 hover:bg-green-500/10'
                            }`}
                            title={user.isActive ? 'Disable user' : 'Enable user'}
                          >
                            {user.isActive ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition"
                            title="Edit user"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            disabled={deletingId === user.id}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                            title="Delete user"
                          >
                            {deletingId === user.id ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Role Legend */}
          <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Role Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                    Administrator
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Full access to all features including user management
                </p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    Editor
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Can create, edit, delete, and publish all blog posts
                </p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    Author
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Can create and edit own posts, but cannot publish
                </p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                    Viewer
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Can only view the dashboard and posts
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
