import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Star, Filter, Grid, List, Building, Globe } from 'lucide-react';
import { shopsAPI, categoriesAPI, type Shop, type Category } from '../services/api';
import { Button, Card, CardContent } from '../components/ui';
import { Navbar, Footer } from '../components/layout';

export function Shops() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categoryId = searchParams.get('category');
  const district = searchParams.get('district');
  const complex = searchParams.get('complex');
  const nearby = searchParams.get('nearby');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data.data;
    },
  });

  // Fetch all shops to get available complexes
  const { data: allShopsData } = useQuery({
    queryKey: ['shops', 'all'],
    queryFn: async () => {
      const response = await shopsAPI.getAll({ limit: 100 });
      return response.data.data;
    },
  });

  // Extract unique complexes from all shops
  const availableComplexes = useMemo(() => {
    if (!allShopsData) return [];
    const complexes = allShopsData
      .map((shop: Shop) => shop.shoppingComplex)
      .filter((complex): complex is string => !!complex);
    return [...new Set(complexes)].sort();
  }, [allShopsData]);

  // Extract unique districts from all shops
  const availableDistricts = useMemo(() => {
    if (!allShopsData) return [];
    const districts = allShopsData
      .map((shop: Shop) => shop.district)
      .filter((district): district is string => !!district);
    return [...new Set(districts)].sort();
  }, [allShopsData]);

  const { data, isLoading } = useQuery({
    queryKey: ['shops', { categoryId, district, complex, nearby }],
    queryFn: async () => {
      if (nearby && navigator.geolocation) {
        // Use nearby API if requested
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          const result = await shopsAPI.nearby({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 10,
          });
          return result.data.data;
        } catch {
          // Fallback to all shops if geolocation fails
          const result = await shopsAPI.getAll();
          return result.data.data;
        }
      } else if (categoryId || district || complex) {
        const result = await shopsAPI.filter({ 
          category: categoryId ? parseInt(categoryId) : undefined,
          district: district || undefined,
          complex: complex || undefined,
        });
        return result.data.data;
      } else {
        const result = await shopsAPI.getAll();
        return result.data.data;
      }
    },
  });

  const handleFilterChange = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {/* District Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={district || ''}
                  onChange={(e) => handleFilterChange('district', e.target.value || null)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Districts</option>
                  {availableDistricts.map((d: string) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              {/* Shopping Complex Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={complex || ''}
                  onChange={(e) => handleFilterChange('complex', e.target.value || null)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Complexes</option>
                  {availableComplexes.map((c: string) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {/* Clear Filters */}
              {(categoryId || district || complex || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    navigate('/shops');
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">All Shops</h1>
            <p className="text-gray-600 mt-2">Find the best shops in Bangladesh</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('category', null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        !categoryId ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categoriesData?.map((cat: Category) => (
                      <button
                        key={cat.id}
                        onClick={() => handleFilterChange('category', cat.id.toString())}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          categoryId === cat.id.toString() ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* District Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    District
                  </h3>
                  <select
                    value={district || ''}
                    onChange={(e) => handleFilterChange('district', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Districts</option>
                    {availableDistricts.map((d: string) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rajshahi">Rajshahi</option>
                  </select>
                </div>

                {/* Shopping Complex Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    <Building className="w-4 h-4 inline mr-1" />
                    Shopping Complex
                  </h3>
                  <select
                    value={complex || ''}
                    onChange={(e) => handleFilterChange('complex', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Complexes</option>
                    {availableComplexes.map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(categoryId || district || complex) && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setSearchParams({})}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Shops Grid/List */}
            <div className="flex-1">
              {/* View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {data?.length || 0} shops found
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-500'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-500'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="h-40 bg-gray-200 rounded-lg mb-4 animate-pulse" />
                      <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : data?.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No shops found</p>
                  <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {data?.map((shop: Shop, index: number) => (
                    <motion.div
                      key={shop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/shops/${shop.id}`}>
                        <Card hover className={viewMode === 'list' ? 'flex' : ''}>
                          <div className={`${viewMode === 'list' ? 'w-48 h-full' : 'h-40'} bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center`}>
                            <Star className="w-12 h-12 text-primary-600" />
                          </div>
                          <CardContent className={viewMode === 'list' ? 'flex-1' : ''}>
                            <h3 className="font-semibold text-gray-900 mb-1">{shop.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{shop.category?.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{shop.district || 'Location not specified'}</span>
                            </div>
                            {shop.shoppingComplex && (
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {shop.shoppingComplex}
                              </p>
                            )}
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
