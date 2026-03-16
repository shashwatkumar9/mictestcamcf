'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { roleDisplayNames, roleDescriptions, type UserRole } from '@/lib/admin/users';

const roles: UserRole[] = ['admin', 'editor', 'author', 'viewer'];

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'author' as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthGuard requireAdmin>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Link href="/admin/users" className="hover:text-indigo-400 transition">
                  Users
                </Link>
                <span>/</span>
                <span className="text-white">Add New User</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Add New User</h1>
              <p className="text-gray-400">Create a new admin panel user with specific permissions</p>
            </div>

            {success ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-white mb-2">User Created Successfully!</h2>
                <p className="text-gray-400 mb-4">
                  A verification email has been sent to {formData.email}
                </p>
                <p className="text-gray-500 text-sm">Redirecting to users list...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    {error}
                  </div>
                )}

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-white">Account Information</h2>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="user@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A verification email will be sent to this address
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Min. 8 characters"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-white">Role & Permissions</h2>

                  <div className="space-y-3">
                    {roles.map((role) => (
                      <label
                        key={role}
                        className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition ${
                          formData.role === role
                            ? 'bg-indigo-500/20 border border-indigo-500/50'
                            : 'bg-gray-900/50 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={formData.role === role}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-indigo-500 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{roleDisplayNames[role]}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              role === 'admin'
                                ? 'bg-purple-500/20 text-purple-400'
                                : role === 'editor'
                                ? 'bg-blue-500/20 text-blue-400'
                                : role === 'author'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {role}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{roleDescriptions[role]}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating User...
                      </span>
                    ) : (
                      'Create User'
                    )}
                  </button>
                  <Link
                    href="/admin/users"
                    className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
