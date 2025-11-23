import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First Name is required';
    if (!formData.lastName.trim()) return 'Last Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (formData.password.length < 6)
      return 'Password must be at least 6 characters long';
    if (formData.password !== formData.confirmPassword)
      return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      email: formData.email,
      password: formData.password,
      role: "artist",               // you can change if needed
      fullName: {
        firstName: formData.firstName,
        lastName: formData.lastName
      }
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setIsSubmitting(false);
        return;
      }

      navigate("/login");

    } catch (err) {
      setError("Something went wrong");
      console.log("Signup Error:", err);
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignup = () => {
    alert("Google signup coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg-dark) p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-(--color-accent-green) rounded-full opacity-5 blur-[120px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900 rounded-full opacity-5 blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-md bg-(--color-bg-card)/80 border-(--color-border-subtle) shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Artist Account</h1>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              icon={User}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              icon={User}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="artist@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              required
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-(--color-border-subtle) flex-1"></div>
            <span className="text-sm text-(--color-text-secondary)">OR</span>
            <div className="h-px bg-(--color-border-subtle) flex-1"></div>
          </div>

          <Button
            variant="google"
            className="w-full flex items-center justify-center gap-3"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </Button>

          <div className="mt-6 text-center text-sm text-(--color-text-secondary)">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:underline">
              Log in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
