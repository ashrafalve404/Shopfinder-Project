import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, CardContent } from '../components/ui';
import { Navbar, Footer } from '../components/layout';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
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

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 text-center font-medium mb-2">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <p className="font-medium">User:</p>
                <p>user@demo.com</p>
                <p>password123</p>
              </div>
              <div>
                <p className="font-medium">Shop Owner:</p>
                <p>owner@demo.com</p>
                <p>password123</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
