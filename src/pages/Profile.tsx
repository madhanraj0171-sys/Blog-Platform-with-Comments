import React, { useEffect, useState } from 'react';
import { usersAPI, postsAPI, PostItem } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Loading } from '../components/Loading.js';
import { User, Mail, Calendar, FileText, Eye, Edit, Trash2, PenSquare, AlertTriangle } from 'lucide-react';

interface ProfileProps {
  onNavigate: (path: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersAPI.getProfilePosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load user posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const confirmDelete = async (postId: string) => {
    try {
      setIsDeleting(true);
      await postsAPI.delete(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setDeletingPostId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Profile Info Card */}
      <div className="bg-white border border-stone-200 rounded p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-2xl font-bold uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-stone-900">
                  {user?.name}
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Author & Contributor at WriteSpace</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/create-post')}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write New Post</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-sm">
          <div className="p-3.5 bg-stone-50 rounded border border-stone-200">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </div>
            <div className="font-medium text-stone-900 truncate">{user?.email}</div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded border border-stone-200">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Member Since</span>
            </div>
            <div className="font-medium text-stone-900">
              {formatDate(user?.createdAt || '2026-08-15T00:00:00.000Z')}
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded border border-stone-200">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Published Posts</span>
            </div>
            <div className="font-medium text-stone-900">{posts.length} articles</div>
          </div>
        </div>
      </div>

      {/* My Posts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">My Posts</h2>
            <p className="text-xs text-stone-500 mt-0.5">Manage, update, or remove your published articles</p>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Total: {posts.length}
          </span>
        </div>

        {loading ? (
          <Loading message="Loading your articles..." />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 text-sm border border-red-200 rounded">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white border border-stone-200 rounded p-6">
            <p className="font-serif text-base font-bold text-stone-800 mb-1">
              You haven't written any blog posts yet.
            </p>
            <p className="text-xs text-stone-500 mb-4">
              Share your coding experiences, tutorials, or student lifestyle tips.
            </p>
            <button
              onClick={() => onNavigate('/create-post')}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Create your first post</span>
            </button>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded divide-y divide-stone-200">
            {posts.map((post) => (
              <div
                key={post._id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                      {post.category}
                    </span>
                    <span className="text-xs text-stone-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <h3
                    onClick={() => onNavigate(`/blogs/${post._id}`)}
                    className="font-serif text-base font-bold text-stone-900 hover:text-stone-700 cursor-pointer line-clamp-1"
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {post.description}
                  </p>
                </div>

                {/* Actions: View, Edit, Delete */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onNavigate(`/blogs/${post._id}`)}
                    className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded flex items-center gap-1 transition-colors"
                    title="View post"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onNavigate(`/edit-post/${post._id}`)}
                    className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded flex items-center gap-1 transition-colors"
                    title="Edit post"
                  >
                    <Edit className="w-3.5 h-3.5 text-stone-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingPostId(post._id)}
                    className="px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded flex items-center gap-1 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {deletingPostId && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded border border-stone-300 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Are you sure you want to delete this post?
              </h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              This will remove the blog post and its discussions from WriteSpace permanently.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setDeletingPostId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-300 rounded hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingPostId)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
