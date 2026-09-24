import React, { useState } from 'react';
import { postsAPI } from '../services/api.js';
import { PenTool, Image as ImageIcon, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CreatePostProps {
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

const PRESET_IMAGES: Record<string, string> = {
  Programming: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  Education: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
  Travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
  Lifestyle: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
  Other: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80',
};

export const CreatePost: React.FC<CreatePostProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a blog title');
      return;
    }
    if (!content.trim()) {
      setError('Please provide the blog content');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const finalImage = imageUrl.trim() || PRESET_IMAGES[category] || PRESET_IMAGES['Other'];

      const newPost = await postsAPI.create({
        title: title.trim(),
        description: description.trim() || title.trim().slice(0, 120) + '...',
        content: content.trim(),
        image: finalImage,
        category,
      });

      // Redirect to newly created blog post details
      onNavigate(`/blogs/${newPost._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const useDefaultImage = () => {
    setImageUrl(PRESET_IMAGES[category]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => onNavigate('/blogs')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Cancel and return</span>
      </button>

      <div className="bg-white border border-stone-200 rounded p-6 sm:p-8">
        <div className="border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2 text-stone-900 mb-1">
            <PenTool className="w-5 h-5" />
            <h1 className="font-serif text-2xl font-bold">Create New Post</h1>
          </div>
          <p className="text-xs text-stone-500">
            Publish an original technical article, learning reflection, or student guide.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I Solved Dynamic Programming with Tabulation"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Category and Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (!imageUrl) setImageUrl(PRESET_IMAGES[e.target.value] || '');
                }}
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Featured Image URL
                </label>
                <button
                  type="button"
                  onClick={useDefaultImage}
                  className="text-[11px] text-blue-700 hover:underline"
                >
                  Use preset photo
                </button>
              </div>
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

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Short Description / Excerpt
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary to show in blog cards (1-2 sentences)"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white"
            />
          </div>

          {/* Full Content */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Blog Content <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-stone-400">Supports markdown and raw paragraphs</span>
            </div>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here. Share your methodology, code snippets, learnings, or insights..."
              className="w-full p-3.5 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-stone-600 focus:bg-white leading-relaxed font-sans"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/blogs')}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
