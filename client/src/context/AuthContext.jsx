import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillsync_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('skillsync_token');
      if (savedToken) {
        try {
          const res = await authService.getProfile();
          setUser(res.data.user);
          localStorage.setItem('skillsync_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session validation failed:', err);
          logout(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      
      localStorage.setItem('skillsync_token', receivedToken);
      localStorage.setItem('skillsync_user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      toast.success(`Welcome back, ${receivedUser.fullName}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const res = await authService.register({ fullName, email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      
      localStorage.setItem('skillsync_token', receivedToken);
      localStorage.setItem('skillsync_user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('skillsync_token');
    localStorage.removeItem('skillsync_user');
    setToken(null);
    setUser(null);
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await authService.updateProfile(formData);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('skillsync_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update profile.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
