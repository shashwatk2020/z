
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedAdmin = localStorage.getItem('admin_user');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        username_input: username,
        password_input: password
      });

      if (error || !data) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Get admin user details
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data)
        .single();

      if (adminError || !adminData) {
        return { success: false, error: 'User not found' };
      }

      const user: AdminUser = {
        id: adminData.id,
        username: adminData.username,
        email: adminData.email,
        role: adminData.role
      };

      setAdminUser(user);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
  };

  const value = {
    adminUser,
    loading,
    login,
    logout,
    isAuthenticated: !!adminUser,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
