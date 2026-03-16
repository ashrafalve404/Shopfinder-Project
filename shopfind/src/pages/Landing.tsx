import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ShoppingBag, Star, ArrowRight, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { categoriesAPI, shopsAPI, type Category, type Shop } from '../services/api';
import { Button, Card, CardContent, LoadingSpinner } from '../components/ui';
import { Navbar, Footer } from '../components/layout';

export function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data.data;
    },
  });

  const { data: shopsData, isLoading: shopsLoading } = useQuery({
    queryKey: ['shops', 'featured'],
    queryFn: async () => {
      const response = await shopsAPI.getAll({ limit: 6 });
      return response.data.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover the Best Shops in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                Bangladesh
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find your favorite stores, browse products, and connect with local businesses. 
              Your shopping journey starts here.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search shops, products..."
                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <Button size="lg" type="submit">
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/shops">
                <Button variant="outline">Browse All Shops</Button>
              </Link>
              <Link to="/categories">
                <Button variant="ghost">View Categories</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-600 mt-2">Explore different types of shops</p>
            </div>
            <Link to="/categories" className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categoriesData?.slice(0, 5).map((category: Category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/shops?category=${category.id}`}>
                    <Card hover className="text-center p-6">
                      <CardContent>
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Shops Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Shops</h2>
              <p className="text-gray-600 mt-2">Popular shops near you</p>
            </div>
            <Link to="/shops" className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {shopsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopsData?.map((shop: Shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/shops/${shop.id}`}>
                    <Card hover className="overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-primary-600" />
                      </div>
                      <CardContent>
                        <h3 className="font-semibold text-gray-900 mb-1">{shop.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{shop.category?.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.district || 'Location not specified'}</span>
                        </div>
                        {shop.mapLink && (
                          <a 
                            href={shop.mapLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 mt-1 flex items-center gap-1 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="w-3 h-3" />
                            View on Map
                          </a>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">{shop.averageRating || 0}</span>
                          <span>({shop._count.reviews} reviews)</span>
                          <span>•</span>
                          <span>{shop._count.products} products</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Own a Shop?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join ShopFinder Bangladesh and reach more customers. List your shop 
            and manage your business easily.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
