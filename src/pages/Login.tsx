import React, { useState } from 'react';
import { authAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { LogIn, KeyRound, Mail, Sparkles } from 'lucide-react';

interface LoginProps {
  onNavigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.login({ email: email.trim(), password });
      login(data.token, data.user);
      onNavigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-stone-200 rounded p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-6 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded bg-stone-900 text-white mx-auto flex items-center justify-center mb-2">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Sign In to WriteSpace</h1>
          <p className="text-xs text-stone-500 mt-1">
            Access your student profile, publish articles, and join discussions.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@student.edu"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Fillers for Evaluator */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Internship Evaluator Quick-Fill:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@student.edu', 'student123')}
              className="py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded text-stone-700 hover:bg-stone-100 text-left transition-colors"
            >
              <span className="font-bold block">Student User</span>
              <span className="text-[10px] text-stone-500">Alex Chen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@writespace.com', 'admin123')}
              className="py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded text-stone-700 hover:bg-stone-100 text-left transition-colors"
            >
              <span className="font-bold block text-amber-900">Admin User</span>
              <span className="text-[10px] text-stone-500">Full Moderation</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-stone-900 font-semibold hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
