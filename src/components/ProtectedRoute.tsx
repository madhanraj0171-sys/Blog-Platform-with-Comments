import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Loading } from './Loading.js';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  onNavigate: (path: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  onNavigate,
}) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-stone-200 rounded text-center">
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
          Authentication Required
        </h3>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          You need to be logged in to access this page. Please sign in or register an account.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onNavigate('/login')}
            className="px-4 py-2 text-sm bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
          >
            Go to Login
          </button>
          <button
            onClick={() => onNavigate('/register')}
            className="px-4 py-2 text-sm bg-stone-100 text-stone-700 border border-stone-200 rounded hover:bg-stone-200 transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded text-center">
        <ShieldAlert className="w-10 h-10 text-red-600 mx-auto mb-3" />
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
          Admin Access Required
        </h3>
        <p className="text-sm text-stone-600 mb-6">
          Your current account does not have administrative privileges to view this section.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 text-sm bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
