'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore, useCartItems, useCartCount, useCartLoading } from '@/stores/cartStore';
import { useAuth } from './useAuth';
import { Product } from '@/types';
import { MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';

// ============================================
// Types
// ============================================
interface UseCartActionsReturn {
  // State (from store)
  items: ReturnType<typeof useCartItems>;
  cartCount: number;
  isLoading: boolean;
  
  // Actions with auth check
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

// ============================================
// Hook
// ============================================
export function useCartActions(): UseCartActionsReturn {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  // Get state from store using selectors
  const items = useCartItems();
  const cartCount = useCartCount();
  const isLoading = useCartLoading();
  
  // Get actions from store
  const { addItem, removeItem, updateQuantity: storeUpdateQuantity, clearCart, fetchCart } = useCartStore();

  /**
   * Add product to cart with authentication check
   */
  const addToCart = useCallback(async (product: Product, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error(MESSAGES.AUTH.LOGIN_REQUIRED);
      router.push(ROUTES.LOGIN);
      return false;
    }

    const success = await addItem(product, quantity);
    
    if (success) {
      toast.success(MESSAGES.CART.ADDED(product.name));
    } else {
      toast.error(MESSAGES.CART.ADD_ERROR);
    }
    
    return success;
  }, [isAuthenticated, router, addItem]);

  /**
   * Remove product from cart
   */
  const removeFromCart = useCallback(async (productId: string | number): Promise<void> => {
    await removeItem(productId);
    toast.info(MESSAGES.CART.REMOVED);
  }, [removeItem]);

  /**
   * Update product quantity in cart
   */
  const updateQuantity = useCallback(async (productId: string | number, quantity: number): Promise<void> => {
    await storeUpdateQuantity(productId, quantity);
  }, [storeUpdateQuantity]);

  /**
   * Refresh cart from server
   */
  const refreshCart = useCallback(async (): Promise<void> => {
    await fetchCart();
  }, [fetchCart]);

  return {
    items,
    cartCount,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
  };
}
