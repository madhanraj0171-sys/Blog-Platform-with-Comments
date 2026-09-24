const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getHeaders = () => {
  const token = localStorage.getItem('writespace_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const errorMsg = data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export interface PostItem {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommentItem {
  _id: string;
  post: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  postTitle?: string;
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<{ token: string; user: UserItem; message: string }>(res);
  },

  register: async (userData: { name: string; email: string; password: string; confirmPassword: string }) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse<{ token: string; user: UserItem; message: string }>(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      headers: getHeaders(),
    });
    return handleResponse<UserItem>(res);
  },
};

export const postsAPI = {
  getAll: async (params?: { search?: string; category?: string; sort?: 'newest' | 'oldest' }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    const url = `${API_BASE}/api/posts${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url);
    return handleResponse<PostItem[]>(res);
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/posts/${id}`);
    return handleResponse<PostItem>(res);
  },

  create: async (postData: { title: string; description: string; content: string; image?: string; category: string }) => {
    const res = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });
    return handleResponse<PostItem>(res);
  },

  update: async (id: string, postData: Partial<{ title: string; description: string; content: string; image: string; category: string }>) => {
    const res = await fetch(`${API_BASE}/api/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });
    return handleResponse<PostItem>(res);
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },
};

export const commentsAPI = {
  getByPost: async (postId: string) => {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`);
    return handleResponse<CommentItem[]>(res);
  },

  create: async (postId: string, content: string) => {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse<CommentItem>(res);
  },

  update: async (commentId: string, content: string) => {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse<CommentItem>(res);
  },

  delete: async (commentId: string) => {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },
};

export const usersAPI = {
  getProfilePosts: async () => {
    const res = await fetch(`${API_BASE}/api/users/profile/posts`, {
      headers: getHeaders(),
    });
    return handleResponse<PostItem[]>(res);
  },
};

export const adminAPI = {
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      headers: getHeaders(),
    });
    return handleResponse<UserItem[]>(res);
  },

  getPosts: async () => {
    const res = await fetch(`${API_BASE}/api/admin/posts`, {
      headers: getHeaders(),
    });
    return handleResponse<PostItem[]>(res);
  },

  deletePost: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  getComments: async () => {
    const res = await fetch(`${API_BASE}/api/admin/comments`, {
      headers: getHeaders(),
    });
    return handleResponse<CommentItem[]>(res);
  },

  deleteComment: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/admin/comments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },
};
