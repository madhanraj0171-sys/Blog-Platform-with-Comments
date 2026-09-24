import React, { useEffect, useState } from 'react';
import { postsAPI, PostItem } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Loading } from '../components/Loading.js';
import { Edit3, ArrowLeft, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface EditPostProps {
  postId: string;
  onNavigate: (path: string) => void;
}

const CATEGORIES = [
  'Technology',
  'Programming',
  'Education',
  'Travel',
  'Lifestyle',
  'Other',
];

export const EditPost: React.FC<EditPostProps> = ({ postId, onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postsAPI.getById(postId);

        const authorId = typeof data.author === 'object' ? data.author._id : data.author;
        const isOwner = user && user._id === authorId;

        if (!isOwner && !isAdmin) {
          setError('You are not authorized to edit this post');
          setLoading(false);
          return;
        }

        setTitle(data.title);
        setDescription(data.description || '');
        setCategory(data.category || 'Other');
        setImageUrl(data.image || '');
        setContent(data.content || '');
      } catch (err: any) {
        setError(err.message || 'Failed to load post for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, user, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      await postsAPI.update(postId, {
        title: title.trim(),
        description: description.trim(),
        category,
        image: imageUrl.trim(),
        content: content.trim(),
      });

      onNavigate(`/blogs/${postId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading message="Loading post details..." />;
  }

  if (error && !title) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-stone-200 rounded text-center">
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Notice</h3>
        <p className="text-sm text-stone-600 mb-6">{error}</p>
        <button
          onClick={() => onNavigate('/blogs')}
          className="px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded"
        >
          Return to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => onNavigate(`/blogs/${postId}`)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to post</span>
      </button>

      <div className="bg-white border border-stone-200 rounded p-6 sm:p-8">
        <div className="border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2 text-stone-900 mb-1">
            <Edit3 className="w-5 h-5" />
            <h1 className="font-serif text-2xl font-bold">Edit Blog Post</h1>
          </div>
          <p className="text-xs text-stone-500">
            Make adjustments to your title, content, or featured image.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Blog Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Featured Image URL
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Short Description / Excerpt
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Blog Content
            </label>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white font-sans leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate(`/blogs/${postId}`)}
              disabled={updating}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{updating ? 'Saving...' : 'Update Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
