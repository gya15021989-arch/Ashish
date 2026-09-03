import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Skater } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  skater: Skater | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSkater: boolean;
  isLoading: boolean;
  login: (credentials: { email?: string; password?: string; registrationNumber?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  activateSkaterAccount: (data: { registrationNumber: string; dateOfBirth: string; password?: string }) => Promise<{ success: boolean; message?: string }>;
  setSessionSkater: (skater: Skater, user?: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  skater: null,
  isAuthenticated: false,
  isAdmin: false,
  isSkater: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  refreshUserData: async () => {},
  activateSkaterAccount: async () => ({ success: false }),
  setSessionSkater: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [skater, setSkater] = useState<Skater | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage safely
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('uprsa_user');
      const savedSkater = localStorage.getItem('uprsa_skater');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedSkater) {
        setSkater(JSON.parse(savedSkater));
      }
    } catch (e) {
      console.error('Failed to parse saved auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { email?: string; password?: string; registrationNumber?: string }) => {
    try {
      const res = await api.login(credentials);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('uprsa_user', JSON.stringify(res.user));
        if (res.token) localStorage.setItem('uprsa_token', res.token);

        if (res.skater) {
          setSkater(res.skater);
          localStorage.setItem('uprsa_skater', JSON.stringify(res.skater));
        } else if (res.user.skaterId) {
          const skaterRes = await api.getSkater(res.user.skaterId);
          if (skaterRes.success && skaterRes.data) {
            setSkater(skaterRes.data);
            localStorage.setItem('uprsa_skater', JSON.stringify(skaterRes.data));
          }
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during login' };
    }
  };

  const activateSkaterAccount = async (data: { registrationNumber: string; dateOfBirth: string; password?: string }) => {
    try {
      const res = await api.activateAccount(data);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('uprsa_user', JSON.stringify(res.user));
        if (res.skater) {
          setSkater(res.skater);
          localStorage.setItem('uprsa_skater', JSON.stringify(res.skater));
        }
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Account activation failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during activation' };
    }
  };

  const logout = () => {
    setUser(null);
    setSkater(null);
    localStorage.removeItem('uprsa_user');
    localStorage.removeItem('uprsa_skater');
    localStorage.removeItem('uprsa_token');
  };

  const refreshUserData = async () => {
    if (user?.skaterId) {
      const res = await api.getSkater(user.skaterId);
      if (res.success && res.data) {
        setSkater(res.data);
        localStorage.setItem('uprsa_skater', JSON.stringify(res.data));
      }
    } else if (skater?.id || skater?.registrationNumber) {
      const idToFetch = skater.id || skater.registrationNumber;
      const res = await api.getSkater(idToFetch);
      if (res.success && res.data) {
        setSkater(res.data);
        localStorage.setItem('uprsa_skater', JSON.stringify(res.data));
      }
    }
  };

  const setSessionSkater = (newSkater: Skater, newUser?: User) => {
    setSkater(newSkater);
    localStorage.setItem('uprsa_skater', JSON.stringify(newSkater));
    
    const userToSet = newUser || {
      id: 'usr-' + newSkater.id,
      email: newSkater.email,
      name: `${newSkater.firstName} ${newSkater.lastName}`,
      role: 'skater' as const,
      skaterId: newSkater.id,
      district: newSkater.district,
      club: newSkater.club
    };
    
    setUser(userToSet);
    localStorage.setItem('uprsa_user', JSON.stringify(userToSet));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isSkater = user?.role === 'skater' || !!skater;

  return (
    <AuthContext.Provider value={{
      user,
      skater,
      isAuthenticated,
      isAdmin,
      isSkater,
      isLoading,
      login,
      logout,
      refreshUserData,
      activateSkaterAccount,
      setSessionSkater
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
