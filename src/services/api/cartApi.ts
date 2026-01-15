import { CartItem } from '@/types';
import { API_ENDPOINTS } from '@/constants/routes';

// ============================================
// Cart API Service
// ============================================
export const cartApi = {
  /**
   * Get current user's cart
   */
  getCart: async (): Promise<CartItem[]> => {
    const res = await fetch(API_ENDPOINTS.CART);
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to fetch cart');
    }
    
    const data = await res.json();
    return data.items || [];
  },

  /**
   * Add product to cart
   */
  addToCart: async (productId: string, quantity: number): Promise<void> => {
    const res = await fetch(API_ENDPOINTS.CART, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to add to cart');
    }
  },

  /**
   * Remove product from cart
   */
  removeFromCart: async (productId: string): Promise<void> => {
    const res = await fetch(`${API_ENDPOINTS.CART}?productId=${productId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to remove from cart');
    }
  },

  /**
   * Update product quantity in cart
   */
  updateQuantity: async (productId: string, quantity: number): Promise<void> => {
    const res = await fetch(API_ENDPOINTS.CART, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update quantity');
    }
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<void> => {
    const res = await fetch(API_ENDPOINTS.CART, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to clear cart');
    }
  },
};
