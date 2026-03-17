import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'shop_owner' | 'admin';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface Shop {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  categoryId: number | null;
  district: string | null;
  shoppingComplex: string | null;
  mapLink: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  ownerId: number;
  owner: { id: number; name: string; email: string };
  category: Category | null;
  _count: { products: number; reviews: number };
  averageRating?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  shopId: number;
  createdAt: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  userId: number;
  shopId: number;
  user: { id: number; name: string };
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  shopId: number;
  user: { id: number; name: string };
}

export interface Post {
  id: number;
  title: string;
  content: string | null;
  image: string | null;
  createdAt: string;
  shopId: number;
  likeCount?: number;
  hasLiked?: boolean;
  shop: {
    id: number;
    name: string;
    image: string | null;
    district: string | null;
    shoppingComplex: string | null;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) => 
    api.post<AuthResponse>('/auth/login', data),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),
};

// Shops API
export const shopsAPI = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<Shop[]>>('/shops', { params }),
  getMyShops: () => api.get<ApiResponse<Shop[]>>('/shops/my/shops'),
  getById: (id: number) => api.get<ApiResponse<Shop>>(`/shops/${id}`),
  search: (params: { q?: string; page?: number; limit?: number }) => 
    api.get<ApiResponse<Shop[]>>('/shops/search', { params }),
  filter: (params: { category?: number; district?: string; complex?: string; page?: number; limit?: number }) => 
    api.get<ApiResponse<Shop[]>>('/shops/filter', { params }),
  nearby: (params: { lat: number; lng: number; radius?: number; page?: number; limit?: number }) => 
    api.get<ApiResponse<Shop[]>>('/shops/nearby', { params }),
  create: (data: FormData) => api.post<ApiResponse<Shop>>('/shops', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put<ApiResponse<Shop>>(`/shops/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete<{ success: boolean; message: string }>(`/shops/${id}`),
};

// Products API
export const productsAPI = {
  getByShop: (shopId: number, params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<Product[]>>(`/products/shop/${shopId}`, { params }),
  create: (data: FormData) => api.post<ApiResponse<Product>>('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put<ApiResponse<Product>>(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete<{ success: boolean; message: string }>(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
  getById: (id: number) => api.get<ApiResponse<Category>>(`/categories/${id}`),
  create: (data: { name: string; icon?: string }) => 
    api.post<ApiResponse<Category>>('/categories', data),
};

// Reviews API
export const reviewsAPI = {
  getByShop: (shopId: number, params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<Review[]>>(`/reviews/shop/${shopId}`, { params }),
  create: (data: { rating: number; comment?: string; shopId: number }) => 
    api.post<ApiResponse<Review>>('/reviews', data),
};

// Comments API
export const commentsAPI = {
  getByShop: (shopId: number, params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<Comment[]>>(`/comments/shop/${shopId}`, { params }),
  create: (data: { content: string; shopId: number }) => 
    api.post<ApiResponse<Comment>>('/comments', data),
};

// Posts API
export const postsAPI = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<Post[]>>('/posts', { params }),
  getById: (id: number) => api.get<ApiResponse<Post>>(`/posts/${id}`),
  getByShop: (shopId: number) => api.get<ApiResponse<Post[]>>(`/posts/shop/${shopId}`),
  create: (data: FormData) => api.post<ApiResponse<Post>>('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete<{ success: boolean; message: string }>(`/posts/${id}`),
  like: (id: number) => api.post<{ success: boolean; message: string }>(`/posts/${id}/like`),
  unlike: (id: number) => api.delete<{ success: boolean; message: string }>(`/posts/${id}/like`),
};

// Admin API
export const adminAPI = {
  // Stats
  getStats: () => api.get<ApiResponse<any>>('/admin/stats'),

  // Users
  getUsers: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<any[]>>('/admin/users', { params }),
  getUser: (id: number) => api.get<ApiResponse<any>>(`/admin/users/${id}`),
  updateUserRole: (id: number, role: string) => 
    api.put<ApiResponse<any>>(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/users/${id}`),

  // Shops
  getShops: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<any[]>>('/admin/shops', { params }),
  getShop: (id: number) => api.get<ApiResponse<any>>(`/admin/shops/${id}`),
  updateShop: (id: number, data: FormData) => 
    api.put<ApiResponse<any>>(`/admin/shops/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteShop: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/shops/${id}`),

  // Products
  getProducts: (params?: { page?: number; limit?: number; shopId?: number }) => 
    api.get<ApiResponse<any[]>>('/admin/products', { params }),
  getProduct: (id: number) => api.get<ApiResponse<any>>(`/admin/products/${id}`),
  updateProduct: (id: number, data: FormData) => 
    api.put<ApiResponse<any>>(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/products/${id}`),

  // Reviews
  getReviews: (params?: { page?: number; limit?: number; shopId?: number }) => 
    api.get<ApiResponse<any[]>>('/admin/reviews', { params }),
  deleteReview: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/reviews/${id}`),

  // Comments
  getComments: (params?: { page?: number; limit?: number; shopId?: number }) => 
    api.get<ApiResponse<any[]>>('/admin/comments', { params }),
  deleteComment: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/comments/${id}`),

  // Posts
  getPosts: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<any[]>>('/admin/posts', { params }),
  deletePost: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/posts/${id}`),
};

export default api;
