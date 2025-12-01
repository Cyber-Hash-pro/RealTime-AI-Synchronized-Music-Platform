import axios from 'axios';
import { setLoading, setUser, setError, logout, clearError } from '../slices/userSlice.jsx';

const API_URL = 'http://localhost:3000/api/auth';

// Re-export clearError for use in components
export { clearError };

// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true,
    });
    
    const userData = response.data.user;
    dispatch(setUser(userData));
    
    // Store user in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true, user: userData };
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch(setError(message));
    return { success: false, message };
  }
};

// Register action
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const payload = {
      email: userData.email,
      password: userData.password,
      role: 'user',
      fullName: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    };
    
    const response = await axios.post(`${API_URL}/register`, payload, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    
    const user = response.data.user;
    dispatch(setUser(user));
    
    // Store user in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(setError(message));
    return { success: false, message };
  }
};

// Google Auth - redirect to Google OAuth
export const googleAuth = () => {
  window.location.href = `${API_URL}/google`;
};

// Check if user is already logged in (from localStorage or cookie)
export const checkAuthStatus = () => async (dispatch) => {
  try {
    // Check localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
      return { success: true };
    }
    
    return { success: false };
  } catch (error) {
    dispatch(setError('Failed to check auth status'));
    return { success: false };
  }
};

// Logout action
export const logoutUser = () => async (dispatch) => {
  try {
    // Clear localStorage
    localStorage.removeItem('user');
    
    dispatch(logout());
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
};
