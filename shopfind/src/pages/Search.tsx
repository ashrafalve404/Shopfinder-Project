import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Star, Search as SearchIcon } from 'lucide-react';
import { shopsAPI, type Shop } from '../services/api';
import { Card, CardContent, LoadingSpinner } from '../components/ui';
import { Navbar, Footer } from '../components/layout';
import { Link } from 'react-router-dom';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const response = await shopsAPI.search({ q: query });
      return response.data.data;
    },
    enabled: query.length > 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {query ? `Search results for "${query}"` : 'Search Shops'}
            </h1>
            <p className="text-gray-600 mt-2">
              {data?.length || 0} results found
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : query && data?.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
              <p className="text-gray-500">Try different keywords or browse categories</p>
              <Link to="/categories" className="inline-block mt-4 text-primary-600 hover:underline">
                Browse Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.map((shop: Shop, index: number) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/shops/${shop.id}`}>
                    <Card hover>
                      <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <Star className="w-12 h-12 text-primary-600" />
                      </div>
                      <CardContent>
                        <h3 className="font-semibold text-gray-900 mb-1">{shop.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{shop.category?.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.district || 'Location not specified'}</span>
                        </div>
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
      </div>

      <Footer />
    </div>
  );
}
