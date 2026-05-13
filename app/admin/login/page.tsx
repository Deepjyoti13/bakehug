'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-warm-900 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="18" cy="22" rx="14" ry="8" fill="#8B4513" />
              <ellipse cx="18" cy="20" rx="13" ry="7" fill="#C17A3D" />
              <ellipse cx="18" cy="18" rx="12" ry="6" fill="#E8A86E" />
              <path d="M12 10 C12 6 18 4 18 4 C18 4 24 6 24 10" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <circle cx="18" cy="10" r="2" fill="#8B4513" />
            </svg>
            <span className="text-2xl font-bold text-warm-500 dark:text-honey-400">BakeHug</span>
          </div>
          <h1 className="text-2xl font-bold text-warm-800 dark:text-warm-100">Admin Login</h1>
          <p className="text-warm-500 dark:text-warm-400 text-sm mt-1">Sign in to manage your bakery</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-lg p-8 border border-warm-100 dark:border-warm-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-xl border border-warm-200 dark:border-warm-600 bg-warm-50 dark:bg-warm-700 text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-warm-500 dark:focus:ring-honey-500 transition"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-xl border border-warm-200 dark:border-warm-600 bg-warm-50 dark:bg-warm-700 text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-warm-500 dark:focus:ring-honey-500 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-warm-500 hover:bg-warm-600 disabled:bg-warm-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
