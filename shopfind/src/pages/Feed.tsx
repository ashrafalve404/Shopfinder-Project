import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsAPI, type Post } from '../services/api';
import { Card, CardContent, LoadingSpinner } from '../components/ui';
import { Navbar, Footer } from '../components/layout';
import { MapPin, Building2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Feed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['feed', page],
    queryFn: async () => {
      const response = await postsAPI.getAll({ page, limit: 20 });
      return response.data.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const post = data?.find(p => p.id === postId);
      if (post?.hasLiked) {
        await postsAPI.unlike(postId);
      } else {
        await postsAPI.like(postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error loading feed</h1>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-24 px-4 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h1>
        
        {data && data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Shop owners can create promotional posts from their dashboard.</p>
            <Link to="/shops" className="text-primary-600 hover:underline mt-2 inline-block">
              Browse shops
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {data?.map((post: Post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.image && (
                  <div className="w-full bg-gray-100">
                    <img
                      src={getImageUrl(post.image) || ''}
                      alt={post.title}
                      className="w-full h-auto max-h-[600px] object-contain"
                    />
                  </div>
                )}
                <CardContent>
                  <div className="flex items-start gap-3">
                    {post.shop.image ? (
                      <img
                        src={getImageUrl(post.shop.image) || ''}
                        alt={post.shop.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Link
                          to={`/shops/${post.shop.id}`}
                          className="text-sm text-primary-600 hover:underline"
                        >
                          {post.shop.name}
                        </Link>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                      </div>
                      {post.shop.district && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{post.shop.district}</span>
                          {post.shop.shoppingComplex && (
                            <span>, {post.shop.shoppingComplex}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {post.content && (
                    <p className="mt-3 text-gray-600 whitespace-pre-wrap">{post.content}</p>
                  )}
                  <div className="mt-4 flex items-center gap-4">
                    {user && (
                      <button
                        onClick={() => likeMutation.mutate(post.id)}
                        className={`flex items-center gap-1 text-sm font-medium ${
                          post.hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`}
                        />
                        {post.likeCount || 0}
                      </button>
                    )}
                    <Link
                      to={`/shops/${post.shop.id}`}
                      className="text-sm text-primary-600 hover:underline font-medium"
                    >
                      View Shop
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
