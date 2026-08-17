import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwtToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const decoded = jwtDecode(savedToken);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (authToken, userData) => {
    localStorage.setItem('jwtToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
