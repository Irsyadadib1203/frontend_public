"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getToken, setToken, removeToken, fetchUserProfile, loginUser, registerUser } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const activeToken = getToken();
    if (!activeToken) {
      setUser(null);
      setTokenState(null);
      setLoading(false);
      return;
    }

    setTokenState(activeToken);
    try {
      const profile = await fetchUserProfile();
      if (profile) {
        setUser(profile);
      } else {
        removeToken();
        setUser(null);
        setTokenState(null);
      }
    } catch (err) {
      console.error('Failed to load auth user:', err);
      removeToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const res = await loginUser(email, pass);
    if (res.success && res.data) {
      setToken(res.data.token);
      setTokenState(res.data.token);
      setUser(res.data.user);
      setLoading(false);
      return { success: true, message: res.message || 'Login berhasil' };
    }
    setLoading(false);
    return { success: false, message: res.message || 'Login gagal, periksa email & password.' };
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    setLoading(true);
    const res = await registerUser(name, email, pass, phone);
    if (res.success && res.data) {
      setToken(res.data.token);
      setTokenState(res.data.token);
      setUser(res.data.user);
      setLoading(false);
      return { success: true, message: res.message || 'Registrasi berhasil' };
    }
    setLoading(false);
    return { success: false, message: res.message || 'Registrasi gagal. Email mungkin sudah terdaftar.' };
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token: tokenState, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
