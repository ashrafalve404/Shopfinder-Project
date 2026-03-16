import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Package, Star, Settings } from 'lucide-react';
import { shopsAPI, productsAPI, categoriesAPI, type Category, type Product, type Shop } from '../services/api';
import { Button, Card, CardContent, Input, Modal, LoadingSpinner } from '../components/ui';
import { Navbar, Footer } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils';

interface ShopForm {
  name: string;
  description: string;
  categoryId: number;
  district: string;
  shoppingComplex: string;
  mapLink: string;
  latitude: number;
  longitude: number;
}

interface ProductForm {
  name: string;
  price: number;
  description: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showShopModal, setShowShopModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [shopImage, setShopImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);

  const { register: registerShop, handleSubmit: handleShopSubmit, reset: resetShop } = useForm<ShopForm>();
  const { register: registerProduct, handleSubmit: handleProductSubmit, reset: resetProduct } = useForm<ProductForm>();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data.data;
    },
  });

  const { data: shopsData, isLoading: shopsLoading } = useQuery({
    queryKey: ['my-shops'],
    queryFn: async () => {
      const response = await shopsAPI.getMyShops();
      return response.data.data;
    },
    enabled: !!user,
  });

  // Get the currently selected shop, or default to first shop
  const currentShop = (selectedShopId 
    ? shopsData?.find(s => s.id === selectedShopId) 
    : shopsData?.[0]) || (shopsData && shopsData.length > 0 ? shopsData[0] : null);
  
  const canCreateShop = shopsData && shopsData.length < 3;

  const { data: productsData } = useQuery({
    queryKey: ['products', currentShop?.id],
    queryFn: async () => {
      if (!currentShop) return [];
      const response = await productsAPI.getByShop(currentShop.id);
      return response.data.data;
    },
    enabled: !!currentShop,
  });

  const createShopMutation = useMutation({
    mutationFn: (data: FormData) => shopsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shops'] });
      setShowShopModal(false);
      resetShop();
    },
  });

  const updateShopMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => shopsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shops'] });
      setShowShopModal(false);
      setEditingShop(null);
      resetShop();
    },
  });

  const deleteShopMutation = useMutation({
    mutationFn: (id: number) => shopsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shops'] });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: FormData) => productsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentShop?.id] });
      setShowProductModal(false);
      resetProduct();
      alert('Product added successfully!');
    },
    onError: (error: Error) => {
      console.error('Error creating product:', error);
      alert('Failed to add product: ' + error.message);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => productsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentShop?.id] });
      setShowProductModal(false);
      setEditingProduct(null);
      resetProduct();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentShop?.id] });
    },
  });

  const onSubmitShop = (data: ShopForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId.toString());
    formData.append('district', data.district);
    formData.append('shoppingComplex', data.shoppingComplex);
    formData.append('mapLink', data.mapLink);
    if (data.latitude) formData.append('latitude', data.latitude.toString());
    if (data.longitude) formData.append('longitude', data.longitude.toString());
    
    if (shopImage) {
      formData.append('image', shopImage);
    }

    if (editingShop) {
      updateShopMutation.mutate({ id: editingShop.id, data: formData });
    } else {
      createShopMutation.mutate(formData);
    }
  };

  const onSubmitProduct = (data: ProductForm) => {
    console.log('Submitting product with currentShop:', currentShop);
    if (!currentShop) {
      console.error('No current shop selected!');
      return;
    }
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    formData.append('shopId', currentShop.id.toString());
    console.log('Form data shopId:', currentShop.id);

    if (productImage) {
      formData.append('image', productImage);
    }

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      console.log('Creating product...');
      createProductMutation.mutate(formData);
    }
  };

  if (user?.role !== 'shop_owner') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only shop owners can access this page</p>
          <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your shop and products</p>
            </div>
          </div>

          {shopsLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : !currentShop ? (
            // No shop yet
            <Card>
              <CardContent className="text-center py-16">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Shop Found</h2>
                <p className="text-gray-500 mb-6">Create your first shop to start selling</p>
                {canCreateShop && (
                  <Button onClick={() => setShowShopModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Shop
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Header with Create Shop button if under limit */}
              {canCreateShop && (
                <div className="flex justify-end">
                  <Button onClick={() => setShowShopModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Shop
                  </Button>
                </div>
              )}
              {!canCreateShop && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">You have reached the maximum of 3 shops.</p>
                </div>
              )}

              {/* All Shops */}
              {shopsData?.map((shop: Shop) => (
                <Card key={shop.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {shop.image && (
                        <img 
                          src={`http://localhost:3000${shop.image}`} 
                          alt={shop.name}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{shop.name}</h2>
                        <p className="text-gray-600">{shop.category?.name}</p>
                        {shop.description && (
                          <p className="text-gray-500 mt-2">{shop.description}</p>
                        )}
                        <div className="flex gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{shop._count?.products || 0} Products</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{shop.averageRating || 0}</span>
                            <span className="text-sm text-gray-400">({shop._count?.reviews || 0} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/shops/${shop.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingShop(shop);
                            setShowShopModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this shop?')) {
                              deleteShopMutation.mutate(shop.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Products Section with shop selector */}
              {shopsData && shopsData.length > 0 && currentShop && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Products</h3>
                    {shopsData.length > 1 && (
                      <select
                        value={selectedShopId || ''}
                        onChange={(e) => setSelectedShopId(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {shopsData.map((shop: Shop) => (
                          <option key={shop.id} value={shop.id}>
                            {shop.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Managing products for: <span className="font-medium text-gray-900">{currentShop.name}</span>
                    </p>
                    <Button size="sm" onClick={() => setShowProductModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                  {productsData && productsData.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No products yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {productsData?.map((product: Product) => (
                        <Card key={product.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                <p className="text-primary-600 font-bold">{formatPrice(product.price)}</p>
                                {product.description && (
                                  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setShowProductModal(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
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
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shop Modal */}
      <Modal 
        isOpen={showShopModal} 
        onClose={() => {
          setShowShopModal(false);
          setEditingShop(null);
          resetShop();
          setShopImage(null);
          setImagePreview(null);
        }} 
        title={editingShop ? 'Edit Shop' : 'Create Shop'}
        size="lg"
      >
        <form onSubmit={handleShopSubmit(onSubmitShop)} className="p-4 space-y-4">
          <Input
            label="Shop Name"
            {...registerShop('name', { required: true })}
            defaultValue={editingShop?.name}
            placeholder="Enter shop name"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              {...registerShop('categoryId', { valueAsNumber: true })}
              defaultValue={editingShop?.categoryId || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select category</option>
              {categoriesData?.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Description"
            {...registerShop('description')}
            defaultValue={editingShop?.description || ''}
            placeholder="Enter shop description"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setShopImage(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {(imagePreview || editingShop?.image) && (
              <div className="mt-2">
                <img 
                  src={imagePreview || (editingShop?.image ? `http://localhost:3000${editingShop.image}` : '')}  
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <Input
            label="District"
            {...registerShop('district')}
            defaultValue={editingShop?.district || ''}
            placeholder="e.g., Dhaka, Chattogram"
          />

          <Input
            label="Shopping Complex"
            {...registerShop('shoppingComplex')}
            defaultValue={editingShop?.shoppingComplex || ''}
            placeholder="e.g., Bashundhara City, Jamuna Future Park"
          />

          <Input
            label="Map Link"
            {...registerShop('mapLink')}
            defaultValue={editingShop?.mapLink || ''}
            placeholder="Google Maps link"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              {...registerShop('latitude', { valueAsNumber: true })}
              defaultValue={editingShop?.latitude || ''}
              placeholder="e.g., 23.8103"
            />

            <Input
              label="Longitude"
              type="number"
              step="any"
              {...registerShop('longitude', { valueAsNumber: true })}
              defaultValue={editingShop?.longitude || ''}
              placeholder="e.g., 90.4125"
            />
          </div>

          <Button type="submit" className="w-full" isLoading={createShopMutation.isPending || updateShopMutation.isPending}>
            {editingShop ? 'Update Shop' : 'Create Shop'}
          </Button>
        </form>
      </Modal>

      {/* Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
          resetProduct();
          setProductImage(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="md"
      >
        <form id="product-form" onSubmit={handleProductSubmit(onSubmitProduct)} className="p-4 space-y-4">
          <Input
            label="Product Name"
            {...registerProduct('name', { required: true })}
            defaultValue={editingProduct?.name}
            placeholder="Enter product name"
          />

          <Input
            label="Price"
            type="number"
            step="any"
            {...registerProduct('price', { required: true, valueAsNumber: true })}
            defaultValue={editingProduct?.price}
            placeholder="Enter price"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...registerProduct('description')}
              defaultValue={editingProduct?.description || ''}
              placeholder="Enter product description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Input
            label="Product Image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProductImage(file);
              }
            }}
          />

          <Button type="submit" className="w-full" isLoading={createProductMutation.isPending || updateProductMutation.isPending}>
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
