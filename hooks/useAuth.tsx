// File: hooks/useAuth.tsx (ganti isi file ini sepenuhnya)
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

// Interface User dan Session disesuaikan dengan response API Laravel (bukan Supabase)
interface User {
  id: string;
  name: string;
  email: string;
  // Tambah field lain jika perlu dari response Laravel
}

interface Session {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.irxplay.com/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Cek token di localStorage saat mount (alih-alih Supabase listener)
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSession({ user: parsedUser, token });
      setIsAdmin(storedIsAdmin);
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: new Error(errorData.message || 'Login failed') };
      }

      const data = await response.json();
      const userData = data.user;
      const token = data.token;
      const isAdminFlag = data.isAdmin;

      // Simpan di localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAdmin', isAdminFlag.toString());

      // Update state
      setUser(userData);
      setSession({ user: userData, token });
      setIsAdmin(isAdminFlag);

      return { error: null };
    } catch (error) {
      console.error('[signIn]', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName || '',
          email,
          password,
          password_confirmation: password,  // Laravel butuh confirmation
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: new Error(errorData.message || 'Register failed') };
      }

      const data = await response.json();
      const userData = data.user;
      const token = data.token;
      const isAdminFlag = data.isAdmin;

      // Simpan di localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAdmin', isAdminFlag.toString());

      // Update state
      setUser(userData);
      setSession({ user: userData, token });
      setIsAdmin(isAdminFlag);

      return { error: null };
    } catch (error) {
      console.error('[signUp]', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('[signOut]', error);
    } finally {
      // Bersihkan localStorage dan state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}