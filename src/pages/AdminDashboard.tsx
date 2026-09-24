import React, { useEffect, useState } from 'react';
import { adminAPI, PostItem, CommentItem, UserItem } from '../services/api.js';
import { Loading } from '../components/Loading.js';
import { Shield, FileText, MessageSquare, Users, Trash2, Eye, ExternalLink, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'users'>('posts');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion state
  const [deleteItem, setDeleteItem] = useState<{ type: 'post' | 'comment'; id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, postsData, commentsData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getPosts(),
        adminAPI.getComments(),
      ]);
      setUsers(usersData);
      setPosts(postsData);
      setComments(commentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    try {
      setIsDeleting(true);
      if (deleteItem.type === 'post') {
        await adminAPI.deletePost(deleteItem.id);
        setPosts((prev) => prev.filter((p) => p._id !== deleteItem.id));
        // comments under this post will also be cleared
        setComments((prev) => prev.filter((c) => c.post !== deleteItem.id));
      } else {
        await adminAPI.deleteComment(deleteItem.id);
        setComments((prev) => prev.filter((c) => c._id !== deleteItem.id));
      }
      setDeleteItem(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-stone-900">
                Admin Moderation Dashboard
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage all registered users, blog articles, and user discussions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-300 rounded hover:bg-stone-200 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100 text-center">
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <div className="text-xs text-stone-500 mb-1">Total Users</div>
            <div className="font-serif text-xl font-bold text-stone-900">{users.length}</div>
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <div className="text-xs text-stone-500 mb-1">Total Posts</div>
            <div className="font-serif text-xl font-bold text-stone-900">{posts.length}</div>
          </div>
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <div className="text-xs text-stone-500 mb-1">Total Comments</div>
            <div className="font-serif text-xl font-bold text-stone-900">{comments.length}</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors -mb-px ${
            activeTab === 'posts'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Blog Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors -mb-px ${
            activeTab === 'comments'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>All Comments ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors -mb-px ${
            activeTab === 'users'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Users ({users.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <Loading message="Loading moderation data..." />
      ) : activeTab === 'posts' ? (
        /* Posts Table */
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Title & Category</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900 line-clamp-1 max-w-md">
                        {post.title}
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 font-medium rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      <div>{post.author?.name || 'Anonymous'}</div>
                      <div className="text-stone-400 text-[11px]">{post.author?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onNavigate(`/blogs/${post._id}`)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                          title="View post"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteItem({
                              type: 'post',
                              id: post._id,
                              title: post.title,
                            })
                          }
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Admin delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'comments' ? (
        /* Comments Table */
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Comment Content</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Post</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 max-w-sm">
                      <p className="text-xs text-stone-900 line-clamp-2">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600 whitespace-nowrap">
                      <div>{comment.user?.name || 'Anonymous'}</div>
                      <div className="text-stone-400 text-[11px]">{comment.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 max-w-xs truncate">
                      {comment.postTitle || comment.post}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() =>
                          setDeleteItem({
                            type: 'comment',
                            id: comment._id,
                            title: comment.content.slice(0, 30) + '...',
                          })
                        }
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Admin delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Users Table */
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-semibold uppercase text-[10px] tracking-wider border ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded border border-stone-300 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Confirm Admin Deletion
              </h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Are you sure you want to delete this {deleteItem.type}: "
              <strong className="text-stone-800">{deleteItem.title}</strong>"?
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setDeleteItem(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-300 rounded hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
