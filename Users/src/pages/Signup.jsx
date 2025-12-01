import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMusic, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, googleAuth, clearError } from '../Store/actions/userAction';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

    const result = await dispatch(registerUser(formData));

    if (result.success) {
      navigate('/');
    } else {
      alert(result.message || 'Signup failed');
    }
  };

  const handleGoogleAuth = () => {
    googleAuth();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1db954] via-[#121212] to-[#000000] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md mx-auto">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <FaMusic className="text-[#1db954] text-4xl" />
            <h1 className="text-4xl font-bold text-white">Musify</h1>
          </div>
          <p className="text-[#b3b3b3] text-base">Create your account and start listening</p>
        </div>

        {/* Form */}
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#282828]">
          <h2 className="text-2xl font-bold text-white mb-5 text-center">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">First Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] text-xs" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="w-full bg-[#242424] text-white pl-10 py-3 rounded-lg focus:ring-2 focus:ring-[#1db954] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Last Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] text-xs" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="w-full bg-[#242424] text-white pl-10 py-3 rounded-lg focus:ring-2 focus:ring-[#1db954] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#242424] text-white pl-12 py-3 rounded-lg focus:ring-2 focus:ring-[#1db954] text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                  className="w-full bg-[#242424] text-white pl-12 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-[#1db954] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b3b3b3]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#1db954]" />
              <p className="text-sm text-[#b3b3b3]">
                I agree to the{" "}
                <span className="text-[#1db954] hover:underline cursor-pointer">Terms of Service</span>{" "}
                and{" "}
                <span className="text-[#1db954] hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
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
              className="w-full bg-[#1db954] text-black py-3.5 rounded-full font-bold hover:bg-[#1ed760] transition-all hover:scale-105 shadow-lg text-base"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 border-t border-[#282828]"></div>
            <span className="text-[#b3b3b3] text-sm">OR</span>
            <div className="flex-1 border-t border-[#282828]"></div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3.5 rounded-full transition-all hover:scale-105 shadow-lg text-base mb-4"
          >
            <FaGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Login */}
          <p className="text-center text-[#b3b3b3] text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1db954] hover:underline font-semibold">
              Log in here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6a6a6a] text-xs mt-6">
          © 2025 Musify. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Signup;
