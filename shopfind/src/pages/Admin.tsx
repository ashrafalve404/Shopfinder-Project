import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Store, Package, Star, MessageSquare, Settings, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { adminAPI } from '../services/api';
import { Button, Card, CardContent, LoadingSpinner } from '../components/ui';
import { Navbar, Footer } from '../components/layout';
import { useAuth } from '../context/AuthContext';

type TabType = 'dashboard' | 'users' | 'shops' | 'products' | 'reviews' | 'comments' | 'posts';

export function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [page, setPage] = useState(1);
  const limit = 10;

  // All queries - called unconditionally
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await adminAPI.getStats();
      return response.data.data;
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: async () => {
      const response = await adminAPI.getUsers({ page, limit });
      return response.data;
    },
    enabled: activeTab === 'users',
  });

  const { data: shopsData, isLoading: shopsLoading } = useQuery({
    queryKey: ['admin', 'shops', page],
    queryFn: async () => {
      const response = await adminAPI.getShops({ page, limit });
      return response.data;
    },
    enabled: activeTab === 'shops',
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin', 'products', page],
    queryFn: async () => {
      const response = await adminAPI.getProducts({ page, limit });
      return response.data;
    },
    enabled: activeTab === 'products',
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['admin', 'reviews', page],
    queryFn: async () => {
      const response = await adminAPI.getReviews({ page, limit });
      return response.data;
    },
    enabled: activeTab === 'reviews',
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['admin', 'comments', page],
    queryFn: async () => {
      const response = await adminAPI.getComments({ page, limit });
      return response.data;
    },
    enabled: activeTab === 'comments',
  });

  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['admin', 'posts', page],
    queryFn: async () => {
      const response = await adminAPI.getPosts({ page, limit });
      return response.data;
    },
    enabled: activeTab === 'posts',
  });

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => 
      adminAPI.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      alert('Role updated successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to update role');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      alert('User deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete user');
    },
  });

  const deleteShopMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteShop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Shop deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete shop');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Product deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete product');
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Review deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete review');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Comment deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete comment');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Post deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete post');
    },
  });

  const deleteProductFromShopMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Product deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete product');
    },
  });

  const deleteReviewFromShopMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Review deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete review');
    },
  });

  const deleteCommentFromShopMutation = useMutation({
    mutationFn: (id: number) => adminAPI.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alert('Comment deleted successfully');
    },
    onError: (error: Error) => {
      alert((error as any).response?.data?.message || 'Failed to delete comment');
    },
  });

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only admins can access this page</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'shops', label: 'Shops Details', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'posts', label: 'Posts', icon: FileText },
  ];

  const renderPagination = (totalPages: number) => (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setPage(p => p + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as TabType); setPage(1); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left mb-1 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div>
                  {statsLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <Card>
                        <CardContent className="text-center py-6">
                          <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-gray-900">{statsData?.totalUsers || 0}</p>
                          <p className="text-gray-500">Total Users</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="text-center py-6">
                          <Store className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-gray-900">{statsData?.totalShops || 0}</p>
                          <p className="text-gray-500">Total Shops</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="text-center py-6">
                          <Package className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-gray-900">{statsData?.totalProducts || 0}</p>
                          <p className="text-gray-500">Total Products</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="text-center py-6">
                          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-gray-900">{statsData?.totalReviews || 0}</p>
                          <p className="text-gray-500">Total Reviews</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="text-center py-6">
                          <MessageSquare className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-gray-900">{statsData?.totalComments || 0}</p>
                          <p className="text-gray-500">Total Comments</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Users by role */}
                  {statsData?.usersByRole && (
                    <Card className="mt-6">
                      <CardContent className="py-6">
                        <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{statsData.usersByRole.user || 0}</p>
                            <p className="text-gray-500">Users</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{statsData.usersByRole.shop_owner || 0}</p>
                            <p className="text-gray-500">Shop Owners</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{statsData.usersByRole.admin || 0}</p>
                            <p className="text-gray-500">Admins</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Users */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Users Management</h2>
                  {usersLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <div className="space-y-4">
                      {usersData?.data?.map((user: any) => (
                        <Card key={user.id}>
                          <CardContent className="flex items-center justify-between py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  user.role === 'admin' ? 'bg-red-100 text-red-600' :
                                  user.role === 'shop_owner' ? 'bg-blue-100 text-blue-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {user.role}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {user._count.shops} shops, {user._count.reviews} reviews
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={user.role}
                                onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                disabled={updateRoleMutation.isPending}
                              >
                                <option value="user">User</option>
                                <option value="shop_owner">Shop Owner</option>
                                <option value="admin">Admin</option>
                              </select>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this user?')) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                                disabled={deleteUserMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {renderPagination(usersData?.pagination?.totalPages || 1)}
                    </div>
                  )}
                </div>
              )}

              {/* Shops */}
              {activeTab === 'shops' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shops Management</h2>
                  {shopsLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <div className="space-y-4">
                      {shopsData?.data?.map((shop: any) => (
                        <Card key={shop.id}>
                          <CardContent className="py-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{shop.name}</p>
                                <p className="text-sm text-gray-500">Owner: {shop.owner?.name} ({shop.owner?.email})</p>
                                <p className="text-sm text-gray-500">
                                  {shop.category?.name} • {shop.district || 'No location'}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    {shop._count.products} Products
                                  </span>
                                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                                    {shop._count.reviews} Reviews
                                  </span>
                                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                    {shop._count.comments} Comments
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this shop? All products, reviews and comments will also be deleted.')) {
                                    deleteShopMutation.mutate(shop.id);
                                  }
                                }}
                                disabled={deleteShopMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {/* Products */}
                            {shop.products && shop.products.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-medium text-gray-900 mb-2">Products ({shop.products.length})</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {shop.products.map((product: any) => (
                                    <div key={product.id} className="bg-gray-50 rounded-lg p-2 text-sm flex items-center justify-between">
                                      <div>
                                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-primary-600">${product.price}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => {
                                          if (confirm('Delete this product?')) {
                                            deleteProductFromShopMutation.mutate(product.id);
                                          }
                                        }}
                                        disabled={deleteProductFromShopMutation.isPending}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Reviews */}
                            {shop.reviews && shop.reviews.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-medium text-gray-900 mb-2">Reviews ({shop.reviews.length})</h4>
                                <div className="space-y-2">
                                  {shop.reviews.map((review: any) => (
                                    <div key={review.id} className="bg-yellow-50 rounded-lg p-2 text-sm flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-gray-900">{review.user?.name}</span>
                                          <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                          </div>
                                        </div>
                                        {review.comment && <p className="text-gray-600 text-xs mt-1">{review.comment}</p>}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => {
                                          if (confirm('Delete this review?')) {
                                            deleteReviewFromShopMutation.mutate(review.id);
                                          }
                                        }}
                                        disabled={deleteReviewFromShopMutation.isPending}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Comments */}
                            {shop.comments && shop.comments.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-medium text-gray-900 mb-2">Comments ({shop.comments.length})</h4>
                                <div className="space-y-2">
                                  {shop.comments.map((comment: any) => (
                                    <div key={comment.id} className="bg-purple-50 rounded-lg p-2 text-sm flex items-start justify-between">
                                      <div className="flex-1">
                                        <span className="font-medium text-gray-900">{comment.user?.name}:</span>
                                        <p className="text-gray-600 text-xs mt-1">{comment.content}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => {
                                          if (confirm('Delete this comment?')) {
                                            deleteCommentFromShopMutation.mutate(comment.id);
                                          }
                                        }}
                                        disabled={deleteCommentFromShopMutation.isPending}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      {renderPagination(shopsData?.pagination?.totalPages || 1)}
                    </div>
                  )}
                </div>
              )}

              {/* Products */}
              {activeTab === 'products' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Products Management</h2>
                  {productsLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <div className="space-y-4">
                      {productsData?.data?.map((product: any) => (
                        <Card key={product.id}>
                          <CardContent className="flex items-center justify-between py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">Shop: {product.shop?.name}</p>
                              <p className="text-sm text-primary-600 font-medium">${product.price}</p>
                              {product.description && (
                                <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                              )}
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                              disabled={deleteProductMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                      {renderPagination(productsData?.pagination?.totalPages || 1)}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews */}
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Reviews Management</h2>
                  {reviewsLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <div className="space-y-4">
                      {reviewsData?.data?.map((review: any) => (
                        <Card key={review.id}>
                          <CardContent className="py-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-gray-900">{review.user?.name}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-500">on {review.shop?.name}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                {review.comment && (
                                  <p className="text-sm text-gray-600">{review.comment}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this review?')) {
                                    deleteReviewMutation.mutate(review.id);
                                  }
                                }}
                                disabled={deleteReviewMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {renderPagination(reviewsData?.pagination?.totalPages || 1)}
                    </div>
                  )}
                </div>
              )}

              {/* Comments */}
              {activeTab === 'comments' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Comments Management</h2>
                  {commentsLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <div className="space-y-4">
                      {commentsData?.data?.map((comment: any) => (
                        <Card key={comment.id}>
                          <CardContent className="py-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-gray-900">{comment.user?.name}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-500">on {comment.shop?.name}</span>
                                </div>
                                <p className="text-sm text-gray-600">{comment.content}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this comment?')) {
                                    deleteCommentMutation.mutate(comment.id);
                                  }
                                }}
                                disabled={deleteCommentMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {renderPagination(commentsData?.pagination?.totalPages || 1)}
                    </div>
                  )}
                </div>
              )}

              {/* Posts */}
              {activeTab === 'posts' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Posts Management</h2>
                  {postsLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : postsError ? (
                    <p className="text-red-500">Error loading posts. Make sure you are logged in as admin.</p>
                  ) : postsData?.data?.length === 0 ? (
                    <p className="text-gray-500">No posts found.</p>
                  ) : (
                    <div className="space-y-4">
                      {postsData?.data?.map((post: any) => (
                        <Card key={post.id}>
                          <CardContent className="py-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-gray-900">{post.author?.name}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-500">from {post.shop?.name || 'Personal'}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                                {post.image && (
                                  <img 
                                    src={post.image} 
                                    alt="Post" 
                                    className="w-24 h-24 object-cover rounded-md mb-2"
                                  />
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <span>{post._count?.likes || 0} likes</span>
                                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this post?')) {
                                    deletePostMutation.mutate(post.id);
                                  }
                                }}
                                disabled={deletePostMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {renderPagination(postsData?.pagination?.totalPages || 1)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
