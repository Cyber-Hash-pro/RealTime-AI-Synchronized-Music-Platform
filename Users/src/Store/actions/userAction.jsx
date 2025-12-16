import axios from 'axios';
import { setLoading, setUser, setError, logout, clearError } from '../slices/userSlice.jsx';
import { AUTH_API } from '../../config/api';

// Re-export clearError for use in components
export { clearError };

// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await axios.post(`${AUTH_API}/login`, credentials, {
      withCredentials: true,
    });
    
    // Backend returns: { message, user: { id, email, fullName: { firstName, lastName }, role } }
    const userData = response.data.user;
    dispatch(setUser(userData));
    
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
    
    const response = await axios.post(`${AUTH_API}/register`, payload, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Backend returns: { message, user: { id, email, fullName: { firstName, lastName }, role } }
    const user = response.data.user;
    dispatch(setUser(user));
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(setError(message));
    return { success: false, message };
  }
};

// Google Auth - redirect to Google OAuth
export const googleAuth = () => {
  window.location.href = `${AUTH_API}/google`;
};



// Logout action - calls backend API to clear cookie
export const logoutUser = () => async (dispatch) => {
  try {
    // Call backend logout endpoint to clear token cookie
    await axios.get(`${AUTH_API}/logout`, {
      withCredentials: true,
    });
    
    // Clear Redux state
    dispatch(logout());
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Clear Redux state even if API call fails
    dispatch(logout());
    return { success: false };
  }
};


// Fetch user profile from backend (uses JWT token from cookie)
// Backend returns: { user: { id, email, fullName: { firstName, lastName }, role } }
export const authenticateUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await axios.get(`${AUTH_API}/user/me`, {
      withCredentials: true,
    });
    
    // Backend returns: { user: { id, email, fullName, role } }
    const user = response.data.user;
    dispatch(setUser(user));
    
    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    dispatch(setError('Authentication failed'));
    return { success: false, error: true, message: 'Authentication failed' };
  }
};