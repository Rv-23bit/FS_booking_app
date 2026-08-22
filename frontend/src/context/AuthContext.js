import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // loading is true while we check localStorage on the first load,
  // so protected routes wait instead of bouncing the user to login.
  const [loading, setLoading] = useState(true);

  // On app start, look for a saved token. If one exists, ask the backend
  // to confirm it is still valid and load the current user.
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get('/api/auth/profile');
        setUser({ ...response.data, token });
      } catch (error) {
        // Token is no longer valid, clear it.
        localStorage.removeItem('token');
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Save the token and basic user details so the session survives a refresh.
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
