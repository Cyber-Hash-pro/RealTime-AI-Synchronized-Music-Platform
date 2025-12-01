import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMusic, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleAuth, clearError } from '../Store/actions/userAction';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(formData));

    if (result.success) {
      navigate('/');
    } else {
      alert(result.message || 'Login failed');
    }
  };

  const handleGoogleAuth = () => {
    googleAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_left,_#1db954_0%,_#0a0a0a_45%,_#000_100%)]">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <FaMusic className="text-[#1db954] text-5xl" />
            <h1 className="text-5xl font-bold text-white">Musify</h1>
          </div>
          <p className="text-[#b3b3b3] text-lg">Welcome back to your music</p>
        </div>

        {/* Login Card */}
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">

          <h2 className="text-3xl font-bold text-white mb-6 text-center">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-sm" />

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-[#1a1a1a] text-white pl-11 pr-4 py-3.5 rounded-lg 
                  border border-[#333] focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954] 
                  placeholder-[#777] transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-sm" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-[#1a1a1a] text-white pl-11 pr-12 py-3.5 rounded-lg 
                  border border-[#333] focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954] 
                  placeholder-[#777] transition-all text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-white transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-[#1db954] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3.5 rounded-full 
              transition-all hover:scale-105 shadow-lg text-base disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="text-[#b3b3b3] text-sm">OR</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3.5 rounded-full transition-all hover:scale-105 shadow-lg text-base mb-4"
          >
            <FaGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-[#b3b3b3]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#1db954] hover:underline font-semibold">
                Sign up for Musify
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6a6a6a] text-sm mt-8">
          © 2025 Musify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
