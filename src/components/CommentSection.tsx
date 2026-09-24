import React, { useState } from 'react';
import { CommentItem } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { MessageSquare, Edit2, Trash2, Check, X, Clock } from 'lucide-react';

interface CommentSectionProps {
  comments: CommentItem[];
  postId: string;
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onNavigateToLogin: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onNavigateToLogin,
}) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment: CommentItem) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
    setDeletingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      setSubmitting(true);
      setErrorMsg(null);
      await onUpdateComment(commentId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (commentId: string) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);
      await onDeleteComment(commentId);
      setDeletingId(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-stone-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-stone-700" />
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Comments ({comments.length})
        </h3>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded">
          {errorMsg}
        </div>
      )}

      {/* Comment Input Box */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="border border-stone-300 rounded bg-white overflow-hidden focus-within:border-stone-500 focus-within:ring-1 focus-within:ring-stone-500">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3.5 text-sm text-stone-800 focus:outline-none resize-y placeholder:text-stone-400"
              disabled={submitting}
            />
            <div className="bg-stone-50 px-3.5 py-2 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
              <span>Posting as <strong className="text-stone-800">{user?.name}</strong></span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-4 py-1.5 bg-stone-900 text-white font-medium text-xs rounded hover:bg-stone-800 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-stone-100 rounded border border-stone-200 text-center">
          <p className="text-sm text-stone-600 mb-2">
            Login to join the discussion and share your feedback.
          </p>
          <button
            onClick={onNavigateToLogin}
            className="px-4 py-1.5 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors"
          >
            Login to Comment
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-stone-500 italic py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => {
            const commentUserId = typeof comment.user === 'object' ? comment.user._id : comment.user;
            const isOwner = user && user._id === commentUserId;
            const canDelete = isOwner || isAdmin;
            const isEditing = editingId === comment._id;
            const isDeleting = deletingId === comment._id;

            return (
              <div
                key={comment._id}
                className="p-4 bg-white rounded border border-stone-200 text-stone-800 space-y-2"
              >
                {/* Comment header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold uppercase">
                      {comment.user?.name ? comment.user.name.charAt(0) : 'U'}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">
                        {comment.user?.name || 'Anonymous User'}
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatDate(comment.createdAt)}
                        {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                          <span className="text-stone-400">(edited)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions for owner or admin */}
                  {!isEditing && !isDeleting && (
                    <div className="flex items-center space-x-1">
                      {isOwner && (
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded text-xs flex items-center gap-1 transition-colors"
                          title="Edit comment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Edit</span>
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeletingId(comment._id)}
                          className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded text-xs flex items-center gap-1 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Comment body or inline edit */}
                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 text-sm border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-500"
                      disabled={submitting}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        disabled={submitting}
                        className="px-2.5 py-1 text-xs border border-stone-300 rounded text-stone-600 hover:bg-stone-50 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(comment._id)}
                        disabled={submitting || !editContent.trim()}
                        className="px-3 py-1 text-xs bg-stone-900 text-white rounded hover:bg-stone-800 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : isDeleting ? (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between">
                    <span>Delete this comment permanently?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-1 bg-white border border-stone-300 text-stone-700 rounded hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => confirmDelete(comment._id)}
                        disabled={submitting}
                        className="px-2.5 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        {submitting ? 'Deleting...' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap pl-9">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
