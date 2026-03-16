import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShoppingBag, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, CardContent } from '../components/ui';
import { Navbar, Footer } from '../components/layout';
import { cn } from '../utils';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  
  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ShopFinder</span>
            </Link>
          </div>

          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
              <p className="text-gray-600 text-center mb-8">Join ShopFinder Bangladesh</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your name"
                  icon={<User className="w-5 h-5" />}
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  error={errors.name?.message}
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail className="w-5 h-5" />}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                />

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">I want to:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={cn(
                        'flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all',
                        selectedRole === 'user' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        value="user"
                        {...register('role', { required: 'Please select a role' })}
                        className="sr-only"
                      />
                      <User className="w-8 h-8 mb-2 text-gray-600" />
                      <span className="font-medium text-gray-900">Shop</span>
                      <span className="text-xs text-gray-500">Browse & Review</span>
                    </label>
                    
                    <label
                      className={cn(
                        'flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all',
                        selectedRole === 'shop_owner' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        value="shop_owner"
                        {...register('role', { required: 'Please select a role' })}
                        className="sr-only"
                      />
                      <UserCog className="w-8 h-8 mb-2 text-gray-600" />
                      <span className="font-medium text-gray-900">Shop Owner</span>
                      <span className="text-xs text-gray-500">Manage Shop</span>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
                  )}
                </div>
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  icon={<Lock className="w-5 h-5" />}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={errors.password?.message}
                />
                
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  icon={<Lock className="w-5 h-5" />}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                  })}
                  error={errors.confirmPassword?.message}
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Create Account
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
