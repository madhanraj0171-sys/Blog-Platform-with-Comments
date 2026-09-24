import React, { useEffect, useState } from 'react';
import { postsAPI, PostItem } from '../services/api.js';
import { BlogCard } from '../components/BlogCard.js';
import { Loading } from '../components/Loading.js';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface BlogsProps {
  initialCategory?: string;
  onNavigate: (path: string) => void;
}

const CATEGORIES = [
  'All',
  'Technology',
  'Programming',
  'Education',
  'Travel',
  'Lifestyle',
  'Other',
];

export const Blogs: React.FC<BlogsProps> = ({ initialCategory = 'All', onNavigate }) => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsAPI.getAll({
        search: searchQuery.trim() || undefined,
        category: selectedCategory,
        sort: sortBy,
      });
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-stone-200">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Articles & Discussions
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Explore technical insights, college tutorials, and student reflections.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-stone-200 rounded p-4 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-grow flex gap-2">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title or keywords..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-500 focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <span className="text-xs text-stone-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="text-xs bg-stone-50 border border-stone-300 rounded px-2.5 py-2 font-medium text-stone-800 focus:outline-none focus:border-stone-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100">
          <span className="text-xs text-stone-500 font-medium mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {(selectedCategory !== 'All' || searchQuery !== '') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-stone-500 hover:text-stone-900 underline ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Post Grid or Status */}
      {loading ? (
        <Loading message="Loading articles..." />
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded text-center">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded p-8">
          <p className="font-serif text-lg font-bold text-stone-800 mb-2">
            No blog posts found.
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            There are no articles matching your current search or category filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      ) : (
        <>
          <div className="text-xs text-stone-500 mb-4 font-medium">
            Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                onReadMore={(id) => onNavigate(`/blogs/${id}`)}
                onCategoryClick={(cat) => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
