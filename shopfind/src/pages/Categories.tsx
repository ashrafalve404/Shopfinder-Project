import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Laptop, Utensils, Book, Sparkles, Dumbbell, Gem, Pill, Home } from 'lucide-react';
import { categoriesAPI, type Category } from '../services/api';
import { Button, Card, CardContent, LoadingSpinner } from '../components/ui';
import { Navbar, Footer } from '../components/layout';

const iconMap: Record<string, React.ElementType> = {
  tshirt: ShoppingBag,
  laptop: Laptop,
  utensils: Utensils,
  book: Book,
  sparkles: Sparkles,
  couch: Home,
  dumbbell: Dumbbell,
  gem: Gem,
  pills: Pill,
  store: ShoppingBag,
};

export function Categories() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop Categories</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse shops by category to find exactly what you're looking for
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.map((category: Category, index) => {
                const Icon = iconMap[category.icon || 'store'] || ShoppingBag;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/shops?category=${category.id}`}>
                      <Card hover className="text-center p-6 h-full">
                        <CardContent className="flex flex-col items-center justify-center h-full">
                          <div className="w-20 h-20 mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                            <Icon className="w-10 h-10 text-primary-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">Are you a shop owner?</p>
            <Link to="/register">
              <Button>List Your Shop</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
