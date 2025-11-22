import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ---------------------------
  // Handle Form Submit
  // ---------------------------
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');

    try {
      // Dummy validation - in real app this would be API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (data.email === 'artist@example.com' && data.password === 'password') {
        alert('Login successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setServerError('Invalid email or password. Try artist@example.com / password');
      }
    } catch (err) {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Google Login (dummy)
  // ---------------------------
  const handleGoogleLogin = () => {
    alert('Google login feature coming soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg-dark) p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-(--color-accent-green) rounded-full opacity-5 blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full opacity-5 blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-md bg-(--color-bg-card)/80 border-(--color-border-subtle) shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-(--color-text-secondary)">Login to your artist dashboard</p>
          </div>

          {/* Error display */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-red-400 text-sm">{serverError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="artist@example.com"
              icon={Mail}
              disabled={loading}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-red-400 text-sm -mt-3">{errors.email.message}</p>
            )}

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              disabled={loading}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-red-400 text-sm -mt-3">{errors.password.message}</p>
            )}

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-(--color-accent-green) hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-(--color-border-subtle) flex-1"></div>
            <span className="text-sm text-(--color-text-secondary)">OR</span>
            <div className="h-px bg-(--color-border-subtle) flex-1"></div>
          </div>

          {/* Google Button */}
          <Button
            variant="google"
            className="w-full flex items-center justify-center gap-3"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </Button>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-(--color-text-secondary)">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white font-medium hover:underline">
              Sign up for free
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
