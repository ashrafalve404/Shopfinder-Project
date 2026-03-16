import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Star, Globe, Clock, ShoppingBag, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { shopsAPI, productsAPI, reviewsAPI, commentsAPI, type Product, type Review, type Comment } from '../services/api';
import { Button, Card, CardContent, Rating, LoadingSpinner, Modal, Input } from '../components/ui';
import { Navbar, Footer } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils';

export function ShopDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);

  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ['shop', id],
    queryFn: async () => {
      const response = await shopsAPI.getById(parseInt(id!));
      return response.data.data;
    },
  });

  // Check if current user is the shop owner
  const isShopOwner = user && shop && user.id === shop.owner?.id;

  const { data: productsData } = useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await productsAPI.getByShop(parseInt(id!));
      return response.data.data;
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const response = await reviewsAPI.getByShop(parseInt(id!));
      return response.data.data;
    },
  });

  const { data: commentsData } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await commentsAPI.getByShop(parseInt(id!));
      return response.data.data;
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: { rating: number; comment?: string; shopId: number }) =>
      reviewsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      setShowReviewModal(false);
      setReviewRating(5);
      setReviewComment('');
      alert('Review submitted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit review';
      alert(message);
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; shopId: number }) =>
      commentsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setShowCommentModal(false);
      setCommentContent('');
      alert('Comment submitted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit comment';
      alert(message);
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: FormData) => productsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      setShowProductModal(false);
      setProductImage(null);
      alert('Product added successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add product';
      alert(message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: number) => productsAPI.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      alert('Product deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete product';
      alert(message);
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    createReviewMutation.mutate({
      rating: reviewRating,
      comment: reviewComment,
      shopId: parseInt(id!),
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    createCommentMutation.mutate({
      content: commentContent,
      shopId: parseInt(id!),
    });
  };

  const handleSubmitProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('shopId', id!);
    if (productImage) {
      formData.append('image', productImage);
    }
    createProductMutation.mutate(formData);
  };

  if (shopLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Shop not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Shop Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8"
          >
            <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600" />
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 -mt-16">
                <div className="flex items-end gap-4">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <Star className="w-10 h-10 text-primary-600 mx-auto" fill="currentColor" />
                      <p className="text-2xl font-bold text-gray-900 mt-1">{shop.averageRating || 0}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
                    <p className="text-gray-600">{shop.category?.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => isAuthenticated ? setShowReviewModal(true) : window.location.href = '/login'}>
                    Write Review
                  </Button>
                  <Button variant="outline" onClick={() => isAuthenticated ? setShowCommentModal(true) : window.location.href = '/login'}>
                    Comment
                  </Button>
                </div>
              </div>

              {/* Shop Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {shop.district || 'Not specified'}
                      {shop.shoppingComplex && `, ${shop.shoppingComplex}`}
                    </p>
                  </div>
                </div>
                {shop.mapLink && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a href={shop.mapLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      View on Map
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Listed</p>
                    <p className="font-medium text-gray-900">
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {shop.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600">{shop.description}</p>
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                {isShopOwner && (
                  <Button size="sm" onClick={() => setShowProductModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
              {productsData?.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productsData?.map((product: Product) => (
                    <Card key={product.id} hover>
                      <CardContent>
                        <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={`http://localhost:3000${product.image}`} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-primary-600 font-bold">{formatPrice(product.price)}</p>
                            {product.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                            )}
                          </div>
                          {isShopOwner && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews & Comments */}
            <div className="space-y-6">
              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
                {reviewsData?.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No reviews yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {reviewsData?.map((review: Review) => (
                      <Card key={review.id}>
                        <CardContent>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-medium">
                                {review.user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.user.name}</p>
                              <Rating value={review.rating} readonly size="sm" />
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  <MessageSquare className="w-6 h-6 inline mr-2" />
                  Comments
                </h2>
                {commentsData?.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No comments yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {commentsData?.map((comment: Comment) => (
                      <Card key={comment.id}>
                        <CardContent>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-sm">
                                {comment.user.name.charAt(0)}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900">{comment.user.name}</p>
                          </div>
                          <p className="text-gray-600 text-sm">{comment.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Review">
        <form onSubmit={handleSubmitReview} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <Rating value={reviewRating} onChange={setReviewRating} />
          </div>
          <Input
            label="Comment (optional)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience..."
          />
          <Button type="submit" className="w-full" isLoading={createReviewMutation.isPending}>
            Submit Review
          </Button>
        </form>
      </Modal>

      {/* Comment Modal */}
      <Modal isOpen={showCommentModal} onClose={() => setShowCommentModal(false)} title="Write a Comment">
        <form onSubmit={handleSubmitComment} className="p-4 space-y-4">
          <Input
            label="Comment"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <Button type="submit" className="w-full" isLoading={createCommentMutation.isPending}>
            Post Comment
          </Button>
        </form>
      </Modal>

      {/* Product Modal */}
      <Modal isOpen={showProductModal} onClose={() => { setShowProductModal(false); setProductImage(null); }} title="Add Product">
        <form onSubmit={handleSubmitProduct} className="p-4 space-y-4">
          <Input
            label="Product Name"
            name="name"
            placeholder="Enter product name"
            required
          />
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            placeholder="Enter price"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter product description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <input type="hidden" name="shopId" value={id} />
          <Button type="submit" className="w-full" isLoading={createProductMutation.isPending}>
            Add Product
          </Button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
