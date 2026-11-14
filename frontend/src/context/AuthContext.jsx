import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('khoi_lms_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.auth.getMe();
      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Fetch current user error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    if (data.token) {
      localStorage.setItem('khoi_lms_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.auth.register(userData);
    if (data.token) {
      localStorage.setItem('khoi_lms_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('khoi_lms_token');
    setToken(null);
    setUser(null);
  };

  const quickSwitch = async (role) => {
    if (role === 'ADMIN') {
      return login('admin@lms.com', 'admin123');
    } else if (role === 'STUDENT') {
      return login('nguyen@student.com', 'student123');
    } else if (role === 'STUDENT2') {
      return login('linh@student.com', 'student123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickSwitch,
        refreshUser: fetchCurrentUser,
        isAdmin: user?.role === 'ADMIN',
        isStudent: user?.role === 'STUDENT',
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
