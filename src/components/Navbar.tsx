import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { BookOpen, PenSquare, User as UserIcon, LogOut, Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNav('/');
  };

  return (
    <nav className="bg-[#faf9f5] border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <span className="w-8 h-8 rounded bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold">
                W
              </span>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-stone-900 block leading-tight">
                  WriteSpace
                </span>
                <span className="text-[11px] text-stone-500 tracking-wider uppercase hidden sm:block">
                  Write. Share. Discuss.
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => handleNav('/')}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  currentPath === '/'
                    ? 'text-stone-950 font-semibold bg-stone-200/60'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNav('/blogs')}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  currentPath === '/blogs'
                    ? 'text-stone-950 font-semibold bg-stone-200/60'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Blogs
              </button>
              <button
                onClick={() => handleNav('/create-post')}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors flex items-center gap-1.5 ${
                  currentPath === '/create-post'
                    ? 'text-stone-950 font-semibold bg-stone-200/60'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <PenSquare className="w-4 h-4 text-stone-500" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Desktop Right Side / Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
                      currentPath === '/admin'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-900 border border-stone-200'
                    }`}
                    title="Admin Dashboard"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    <span>Admin</span>
                  </button>
                )}

                <button
                  onClick={() => handleNav('/profile')}
                  className={`px-3 py-1.5 text-sm font-medium rounded flex items-center gap-2 border transition-colors ${
                    currentPath === '/profile'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span className="max-w-[130px] truncate">{user.name}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-stone-100 rounded transition-colors"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 rounded hover:bg-stone-100 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 space-y-1">
            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded ${
                currentPath === '/' ? 'bg-stone-200/70 text-stone-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/blogs')}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded ${
                currentPath === '/blogs' ? 'bg-stone-200/70 text-stone-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              Blogs
            </button>
            <button
              onClick={() => handleNav('/create-post')}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded flex items-center gap-2 ${
                currentPath === '/create-post' ? 'bg-stone-200/70 text-stone-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <PenSquare className="w-4 h-4 text-stone-500" />
              Create Post
            </button>

            <div className="pt-2 border-t border-stone-200">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-1 text-xs text-stone-500 uppercase tracking-wider font-semibold">
                    Signed in as {user.name} ({user.role})
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleNav('/admin')}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 rounded flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => handleNav('/profile')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-stone-500" />
                    Profile & My Posts
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1 px-1">
                  <button
                    onClick={() => handleNav('/login')}
                    className="text-center py-2 text-sm font-medium text-stone-700 bg-stone-100 rounded border border-stone-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNav('/register')}
                    className="text-center py-2 text-sm font-medium text-white bg-stone-900 rounded"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
