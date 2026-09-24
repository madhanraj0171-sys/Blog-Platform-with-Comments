import React, { useEffect, useState } from 'react';
import { postsAPI, PostItem } from '../services/api.js';
import { BlogCard } from '../components/BlogCard.js';
import { Loading } from '../components/Loading.js';
import { ArrowRight, BookOpen, Layers, Terminal, Sparkles, Compass } from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string, params?: any) => void;
}

const CATEGORIES = [
  { name: 'Technology', count: 'Tech & Web', icon: Terminal },
  { name: 'Programming', count: 'Languages & Architecture', icon: BookOpen },
  { name: 'Education', count: 'Learning & Study Tips', icon: Sparkles },
  { name: 'Travel', count: 'Places & Reset', icon: Compass },
  { name: 'Lifestyle', count: 'Habits & Student Life', icon: Layers },
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [latestPosts, setLatestPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postsAPI.getAll({ sort: 'newest' });
        setLatestPosts(data.slice(0, 4)); // Show 4 latest
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-stone-200 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded border border-stone-300 bg-[#faf9f5] text-xs font-medium text-stone-700 tracking-wide">
            <span>Internship Capstone Project</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500 font-mono">v1.0</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-5">
            Share your ideas with the world.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Write about what you know, discover new ideas, and join conversations through simple and meaningful blog posts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/blogs')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 text-white font-medium text-sm rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Blogs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/create-post')}
              className="w-full sm:w-auto px-6 py-3 bg-[#faf9f5] text-stone-800 border border-stone-300 font-medium text-sm rounded hover:bg-stone-100 transition-colors"
            >
              Start Writing
            </button>
          </div>

          {/* Quick Evaluator Notice */}
          <div className="mt-8 pt-6 border-t border-stone-100 max-w-lg mx-auto text-left sm:text-center text-xs text-stone-500">
            <span className="font-semibold text-stone-700">Quick Demo Accounts:</span> Student:{' '}
            <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">alex@student.edu</code> (pwd: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">student123</code>) | Admin:{' '}
            <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">admin@writespace.com</code> (pwd: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">admin123</code>)
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Popular Categories</h2>
            <p className="text-xs text-stone-500 mt-0.5">Explore articles by topic</p>
          </div>
          <button
            onClick={() => onNavigate('/blogs')}
            className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onNavigate('/blogs', { category: cat.name })}
                className="p-4 bg-white border border-stone-200 rounded text-left hover:border-stone-400 hover:bg-stone-50/50 transition-all group"
              >
                <Icon className="w-5 h-5 text-stone-600 mb-2 group-hover:text-stone-900 transition-colors" />
                <div className="font-semibold text-sm text-stone-900">{cat.name}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">{cat.count}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Latest Posts</h2>
            <p className="text-xs text-stone-500 mt-0.5">Recent articles from student authors and developers</p>
          </div>
          <button
            onClick={() => onNavigate('/blogs')}
            className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1"
          >
            <span>Browse All Posts</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <Loading message="Loading latest articles..." />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 text-sm border border-red-200 rounded text-center">
            {error}
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded border border-stone-200">
            <p className="text-sm text-stone-500">No posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPosts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                onReadMore={(id) => onNavigate(`/blogs/${id}`)}
                onCategoryClick={(category) => onNavigate('/blogs', { category })}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
