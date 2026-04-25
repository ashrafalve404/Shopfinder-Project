import axios, { type AxiosResponse } from 'axios';

// --- Types ---
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

// --- Mock Data ---
export const mockCategories: Category[] = [
  { id: 1, name: 'Clothing & Fashion', icon: '👕' },
  { id: 2, name: 'Electronics & Gadgets', icon: '📱' },
  { id: 3, name: 'Food & Restaurant', icon: '🍕' },
  { id: 4, name: 'Beauty & Cosmetics', icon: '💄' },
  { id: 5, name: 'Home & Furniture', icon: '🏠' },
  { id: 6, name: 'Books & Stationery', icon: '📚' },
  { id: 7, name: 'Jewelry & Accessories', icon: '💎' },
  { id: 8, name: 'Sports & Fitness', icon: '⚽' },
];

export const mockShops: Shop[] = [
  {
    id: 1,
    name: 'Aarong - Bashundhara (Demo)',
    description: 'Authentic Bangladeshi lifestyle retail chain with heritage and craftsmanship.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    categoryId: 1,
    district: 'Dhaka',
    shoppingComplex: 'Bashundhara City',
    mapLink: 'https://goo.gl/maps/BashundharaCity',
    latitude: 23.7509,
    longitude: 90.3935,
    createdAt: new Date().toISOString(),
    ownerId: 101,
    owner: { id: 101, name: 'Aarong Admin', email: 'aarong@example.com' },
    category: mockCategories[0],
    _count: { products: 12, reviews: 450 },
    averageRating: 4.8,
  },
  {
    id: 2,
    name: 'Star Tech - Multiplan (Demo)',
    description: 'Leading computer and laptop shop in Bangladesh with latest technology.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    categoryId: 2,
    district: 'Dhaka',
    shoppingComplex: 'Multiplan Center',
    mapLink: 'https://goo.gl/maps/Multiplan',
    latitude: 23.7384,
    longitude: 90.3853,
    createdAt: new Date().toISOString(),
    ownerId: 102,
    owner: { id: 102, name: 'Star Tech Admin', email: 'startech@example.com' },
    category: mockCategories[1],
    _count: { products: 250, reviews: 890 },
    averageRating: 4.7,
  },
  {
    id: 3,
    name: 'Yellow - Banani (Demo)',
    description: 'A trendsetting fashion brand offering contemporary styles for youth.',
    image: 'https://images.unsplash.com/photo-1441984969813-91c795efe330?w=800&q=80',
    categoryId: 1,
    district: 'Dhaka',
    shoppingComplex: 'Banani 11',
    mapLink: 'https://goo.gl/maps/Banani11',
    latitude: 23.7937,
    longitude: 90.4066,
    createdAt: new Date().toISOString(),
    ownerId: 103,
    owner: { id: 103, name: 'Yellow Admin', email: 'yellow@example.com' },
    category: mockCategories[0],
    _count: { products: 45, reviews: 120 },
    averageRating: 4.5,
  },
  {
    id: 4,
    name: 'Sanmar Ocean City - CTG (Demo)',
    description: 'A premier shopping destination in Chittagong for all your needs.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    categoryId: 3,
    district: 'Chittagong',
    shoppingComplex: 'Sanmar Ocean City',
    mapLink: 'https://goo.gl/maps/Sanmar',
    latitude: 22.3569,
    longitude: 91.7832,
    createdAt: new Date().toISOString(),
    ownerId: 104,
    owner: { id: 104, name: 'Sanmar Admin', email: 'sanmar@example.com' },
    category: mockCategories[2],
    _count: { products: 500, reviews: 2500 },
    averageRating: 4.6,
  },
  {
    id: 5,
    name: 'Aura Perfumes (Demo)',
    description: 'Exclusive collection of original designer perfumes and fragrances.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    categoryId: 4,
    district: 'Sylhet',
    shoppingComplex: 'Zindabazar',
    mapLink: 'https://goo.gl/maps/Zindabazar',
    latitude: 24.8917,
    longitude: 91.8667,
    createdAt: new Date().toISOString(),
    ownerId: 105,
    owner: { id: 105, name: 'Aura Admin', email: 'aura@example.com' },
    category: mockCategories[3],
    _count: { products: 80, reviews: 340 },
    averageRating: 4.9,
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Nakshi Kantha Panjabi',
    price: 4500,
    description: 'Traditional hand-stitched silk panjabi with intricate details.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    shopId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Premium Muslin Saree',
    price: 15000,
    description: 'Authentic Dhakai Muslin saree with traditional patterns.',
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&q=80',
    shopId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'MacBook Pro M3 Max',
    price: 345000,
    description: 'The most powerful MacBook yet with extreme performance.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    shopId: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    price: 42000,
    description: 'Best-in-class noise cancelling wireless headphones.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    shopId: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Dior Sauvage Elixir',
    price: 18500,
    description: 'An extraordinarily concentrated fragrance steeped in the emblematic freshness.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    shopId: 5,
    createdAt: new Date().toISOString(),
  },
];

export const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Eid-ul-Fitr Grand Sale!',
    content: 'Get up to 50% discount on our entire summer collection. Visit our Bashundhara City branch today!',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    createdAt: new Date().toISOString(),
    shopId: 1,
    likeCount: 1500,
    hasLiked: false,
    shop: {
      id: 1,
      name: 'Aarong',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      district: 'Dhaka',
      shoppingComplex: 'Bashundhara City',
    },
  },
  {
    id: 2,
    title: 'New Store Launch in Sylhet!',
    content: 'We are excited to announce our new branch in Zindabazar. First 100 customers get free gifts!',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    createdAt: new Date().toISOString(),
    shopId: 5,
    likeCount: 850,
    hasLiked: true,
    shop: {
      id: 5,
      name: 'Aura Perfumes',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
      district: 'Sylhet',
      shoppingComplex: 'Zindabazar',
    },
  },
  {
    id: 3,
    title: 'NVIDIA RTX 5090 Pre-order!',
    content: 'Be the first to own the ultimate GPU. Limited stock available for pre-order at all Star Tech branches.',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
    createdAt: new Date().toISOString(),
    shopId: 2,
    likeCount: 4200,
    hasLiked: false,
    shop: {
      id: 2,
      name: 'Star Tech',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      district: 'Dhaka',
      shoppingComplex: 'Multiplan Center',
    },
  },
];

const mockAxiosResponse = <T>(data: T): AxiosResponse<ApiResponse<T>> => ({
  data: {
    success: true,
    message: 'Data loaded from demo fallback',
    data,
    pagination: { page: 1, limit: 10, total: Array.isArray(data) ? data.length : 1, totalPages: 1 },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
});

// --- API Instance ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

// --- Mock Auth Responses ---
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Demo Admin',
    email: 'admin@demo.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Demo Shop Owner',
    email: 'owner@demo.com',
    role: 'shop_owner',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Demo User',
    email: 'user@demo.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

const mockAuthResponse = (email: string): AxiosResponse<AuthResponse> => {
  const user = mockUsers.find(u => u.email === email) || mockUsers[2];
  return {
    data: {
      success: true,
      message: 'Logged in with demo fallback',
      data: {
        user,
        token: 'mock-jwt-token',
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
};

// --- API Endpoints ---
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) => 
    api.post<AuthResponse>('/auth/login', data).catch(() => mockAuthResponse(data.email)),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile').catch(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null') || mockUsers[2];
    return mockAxiosResponse(user);
  }),
};

export const shopsAPI = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<Shop[]>>('/shops', { params }).catch(() => mockAxiosResponse(mockShops)),
  getMyShops: () => api.get<ApiResponse<Shop[]>>('/shops/my/shops'),
  getById: (id: number) => 
    api.get<ApiResponse<Shop>>(`/shops/${id}`).catch(() => mockAxiosResponse(mockShops.find(s => s.id === id) || mockShops[0])),
  search: (params: { q?: string; page?: number; limit?: number }) => 
    api.get<ApiResponse<Shop[]>>('/shops/search', { params }).catch(() => mockAxiosResponse(mockShops)),
  filter: (params: { category?: number; district?: string; complex?: string; page?: number; limit?: number }) => 
    api.get<ApiResponse<Shop[]>>('/shops/filter', { params }).catch(() => mockAxiosResponse(mockShops)),
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

export const productsAPI = {
  getByShop: (shopId: number) => 
    api.get<ApiResponse<Product[]>>(`/products/shop/${shopId}`).catch(() => mockAxiosResponse(mockProducts.filter(p => p.shopId === shopId))),
  create: (data: FormData) => api.post<ApiResponse<Product>>('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put<ApiResponse<Product>>(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete<{ success: boolean; message: string }>(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories').catch(() => mockAxiosResponse(mockCategories)),
  create: (data: { name: string; icon?: string }) => 
    api.post<ApiResponse<Category>>('/categories', data),
};

export const postsAPI = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get<ApiResponse<Post[]>>('/posts', { params }).catch(() => mockAxiosResponse(mockPosts)),
  create: (data: FormData) => api.post<ApiResponse<Post>>('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  like: (id: number) => api.post<ApiResponse<any>>(`/posts/${id}/like`),
  unlike: (id: number) => api.delete<ApiResponse<any>>(`/posts/${id}/like`),
};

export const reviewsAPI = {
  getByShop: (shopId: number) => 
    api.get<ApiResponse<Review[]>>(`/reviews/shop/${shopId}`).catch(() => mockAxiosResponse([])),
  create: (data: { rating: number; comment?: string; shopId: number }) => 
    api.post<ApiResponse<Review>>('/reviews', data),
};

export const commentsAPI = {
  getByShop: (shopId: number) => 
    api.get<ApiResponse<Comment[]>>(`/comments/shop/${shopId}`).catch(() => mockAxiosResponse([])),
  create: (data: { content: string; shopId: number }) => 
    api.post<ApiResponse<Comment>>('/comments', data),
};

export const adminAPI = {
  getStats: () => api.get<ApiResponse<any>>('/admin/stats'),
  getUsers: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<any>>('/admin/users', { params }),
  updateUserRole: (id: number, role: string) => api.put<ApiResponse<any>>(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/users/${id}`),
  
  getShops: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<any>>('/admin/shops', { params }),
  deleteShop: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/shops/${id}`),
  
  getProducts: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<any>>('/admin/products', { params }),
  deleteProduct: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/products/${id}`),
  
  getReviews: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<any>>('/admin/reviews', { params }),
  deleteReview: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/reviews/${id}`),
  
  getComments: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<any>>('/admin/comments', { params }),
  deleteComment: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/comments/${id}`),
  
  getPosts: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<any>>('/admin/posts', { params }),
  deletePost: (id: number) => api.delete<{ success: boolean; message: string }>(`/admin/posts/${id}`),
};

export default api;
