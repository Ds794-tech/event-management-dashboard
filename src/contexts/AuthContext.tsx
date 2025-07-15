import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => void;
  signup: (email: string, username: string, password: string, navigate: NavigateFunction) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedIn');
    if (storedUser) {
      setUser(JSON.parse(storedUser)._id);
    }
  }, []);

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((user: { email: string; password: string }) =>
      user.email === email && user.password === password
    );


    if (foundUser) {
      setUser(foundUser._id);
      localStorage.setItem('loggedIn', JSON.stringify({ email: foundUser.email, username: foundUser.username, _id: foundUser._id }));
    } else {
      alert('Invalid username or password');
    }
  };

  const signup = (email: string, username: string, password: string, navigate: NavigateFunction) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((user: { email: string }) => user.email === email)) {
      alert('Username already exists');
      return;
    }
    users.push({ email, username, password, _id: uuidv4() });
    localStorage.setItem('users', JSON.stringify(users));
    navigate('/login');
    alert('Registered successful');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedIn');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};