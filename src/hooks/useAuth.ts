'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ROUTES } from '@/constants/routes';

// ============================================
// Types
// ============================================
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: 'user' | 'admin' | 'farmer';
}

interface UseAuthReturn {
  // User data
  user: User | null;
  userId: string | null;
  userName: string;
  userRole: string | null;
  
  // Status
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Role checks
  isAdmin: boolean;
  isFarmer: boolean;
  isUser: boolean;
  
  // Actions
  logout: () => void;
  requireAuth: (callback: () => void) => boolean;
}

// ============================================
// Hook
// ============================================
export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  
  // Extract user data with proper typing
  const user = session?.user as User | null;
  const userId = (user as any)?.id || null;
  const userName = user?.name || 'User';
  const userRole = (user as any)?.role || null;

  // Role checks
  const isAdmin = userRole === 'admin';
  const isFarmer = userRole === 'farmer';
  const isUser = userRole === 'user';

  // Logout action
  const logout = useCallback(() => {
    signOut({ callbackUrl: ROUTES.LOGIN });
  }, []);

  /**
   * Check if user is authenticated before executing callback
   * Returns true if authenticated, false otherwise
   * Redirects to login if not authenticated
   */
  const requireAuth = useCallback((callback: () => void): boolean => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return false;
    }
    callback();
    return true;
  }, [isAuthenticated, router]);

  return {
    user,
    userId,
    userName,
    userRole,
    isAuthenticated,
    isLoading,
    isAdmin,
    isFarmer,
    isUser,
    logout,
    requireAuth,
  };
}
