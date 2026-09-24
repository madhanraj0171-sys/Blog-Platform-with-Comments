import React, { useState } from 'react';
import { PostItem } from '../services/api.js';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: PostItem;
  onReadMore: (id: string) => void;
  onCategoryClick?: (category: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore, onCategoryClick }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'programming':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'technology':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'education':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'travel':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'lifestyle':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="bg-white border border-stone-200 rounded-sm overflow-hidden flex flex-col hover:border-stone-400 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Featured Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onReadMore(post._id)}>
        <img
          src={imageError ? fallbackImage : (post.image || fallbackImage)}
          alt={post.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCategoryClick?.(post.category);
            }}
            className={`text-xs px-2.5 py-0.5 font-medium rounded border ${getCategoryColor(post.category)} transition-opacity hover:opacity-90`}
          >
            {post.category}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          onClick={() => onReadMore(post._id)}
          className="font-serif text-lg font-bold text-stone-900 leading-snug mb-2 cursor-pointer hover:text-stone-700 transition-colors line-clamp-2"
        >
          {post.title}
        </h3>

        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {post.description}
        </p>

        {/* Card Footer: Author, Date, Button */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto text-xs text-stone-500">
          <div className="flex flex-col space-y-0.5">
            <span className="flex items-center gap-1 font-medium text-stone-700">
              <User className="w-3 h-3 text-stone-400" />
              {post.author?.name || 'Anonymous'}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-stone-400">
              <Calendar className="w-3 h-3 text-stone-400" />
              {formatDate(post.createdAt)}
            </span>
          </div>

          <button
            onClick={() => onReadMore(post._id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 hover:text-stone-950 py-1 px-2.5 rounded bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            <span>Read More</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
