import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { Home } from './pages/Home.js';
import { Blogs } from './pages/Blogs.js';
import { BlogDetails } from './pages/BlogDetails.js';
import { CreatePost } from './pages/CreatePost.js';
import { EditPost } from './pages/EditPost.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { Profile } from './pages/Profile.js';
import { AdminDashboard } from './pages/AdminDashboard.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [navParams, setNavParams] = useState<any>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setNavParams(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
    setNavParams(params || null);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // In some sandboxed iframes pushState may be restricted
    }
  };

  // Simple Router Matching
  const renderCurrentPage = () => {
    // Exact routes
    if (currentPath === '/' || currentPath === '') {
      return <Home onNavigate={navigate} />;
    }

    if (currentPath === '/blogs') {
      return <Blogs initialCategory={navParams?.category || 'All'} onNavigate={navigate} />;
    }

    if (currentPath === '/create-post') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <CreatePost onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/login') {
      return <Login onNavigate={navigate} />;
    }

    if (currentPath === '/register') {
      return <Register onNavigate={navigate} />;
    }

    if (currentPath === '/profile') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <Profile onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/admin') {
      return (
        <ProtectedRoute adminOnly onNavigate={navigate}>
          <AdminDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // Dynamic routes: /blogs/:id
    if (currentPath.startsWith('/blogs/')) {
      const postId = currentPath.replace('/blogs/', '');
      return <BlogDetails postId={postId} onNavigate={navigate} />;
    }

    // Dynamic routes: /edit-post/:id
    if (currentPath.startsWith('/edit-post/')) {
      const postId = currentPath.replace('/edit-post/', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <EditPost postId={postId} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // Fallback: 404 page
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-stone-200 rounded text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">404 - Page Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">
          The requested path does not exist on WriteSpace.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#faf9f5] text-stone-900 antialiased selection:bg-stone-200 selection:text-stone-900">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-grow">{renderCurrentPage()}</main>
        <Footer onNavigate={navigate} />
      </div>
    </AuthProvider>
  );
}
