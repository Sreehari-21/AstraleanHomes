import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Helper function to decode JWT token
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Create the Auth Context
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('jwt_token');
    return savedToken ? decodeJwt(savedToken) : null;
  });

  // Effect to decode token and set user when token changes
  useEffect(() => {
    if (token) {
      const decodedUser = decodeJwt(token);
      setUser(decodedUser);
    } else {
      setUser(null);
    }
  }, [token]);

  // Login function
  const login = useCallback((newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setToken(null);
  }, []);

  // Derived state
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!token;

  // Memoize the context value
  const authContextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  }), [user, token, login, logout, isAdmin, isAuthenticated]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
