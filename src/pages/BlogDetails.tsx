import React, { useEffect, useState } from 'react';
import { postsAPI, commentsAPI, PostItem, CommentItem } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { CommentSection } from '../components/CommentSection.js';
import { Loading } from '../components/Loading.js';
import { Calendar, User, ArrowLeft, Edit, Trash2, Tag, AlertTriangle } from 'lucide-react';

interface BlogDetailsProps {
  postId: string;
  onNavigate: (path: string) => void;
}

export const BlogDetails: React.FC<BlogDetailsProps> = ({ postId, onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState<PostItem | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [postData, commentsData] = await Promise.all([
        postsAPI.getById(postId),
        commentsAPI.getByPost(postId),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostAndComments();
  }, [postId]);

  const handleAddComment = async (content: string) => {
    const newComment = await commentsAPI.create(postId, content);
    setComments((prev) => [...prev, newComment]);
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    const updated = await commentsAPI.update(commentId, content);
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? updated : c))
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    await commentsAPI.delete(commentId);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleDeletePost = async () => {
    try {
      setDeleting(true);
      await postsAPI.delete(postId);
      setShowDeleteModal(false);
      onNavigate('/blogs');
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <Loading message="Loading article & discussion..." />;
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white border border-stone-200 rounded text-center">
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
          {error || 'Post not found'}
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          The requested article could not be found or may have been deleted.
        </p>
        <button
          onClick={() => onNavigate('/blogs')}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </button>
      </div>
    );
  }

  const authorId = typeof post.author === 'object' ? post.author._id : post.author;
  const isOwner = user && user._id === authorId;
  const canModify = isOwner || isAdmin;

  const fallbackImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/blogs')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to all posts</span>
      </button>

      {/* Article Header */}
      <header className="mb-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 font-semibold rounded bg-stone-100 text-stone-800 border border-stone-200">
            <Tag className="w-3 h-3 text-stone-500" />
            {post.category}
          </span>

          {/* Action buttons if owner or admin */}
          {canModify && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(`/edit-post/${post._id}`)}
                className="px-3 py-1 text-xs font-medium bg-white text-stone-700 border border-stone-300 rounded hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5 text-stone-500" />
                <span>Edit Post</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-stone-600 leading-relaxed italic border-l-2 border-stone-300 pl-3">
          {post.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-stone-800">
              {post.author?.name || 'Anonymous'}
            </span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="aspect-[16/9] w-full overflow-hidden rounded bg-stone-100 mb-8 border border-stone-200">
        <img
          src={imageError ? fallbackImage : (post.image || fallbackImage)}
          alt={post.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Full Content Body */}
      <article className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
        {post.content}
      </article>

      {/* Comment Section */}
      <CommentSection
        comments={comments}
        postId={postId}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onNavigateToLogin={() => onNavigate('/login')}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded border border-stone-300 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Confirm Post Deletion
              </h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Are you sure you want to delete this post? This will permanently remove the article and all its associated comments. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-300 rounded hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
