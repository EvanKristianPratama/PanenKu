import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { cartApi } from '@/services/api/cartApi';

// ============================================
// Types
// ============================================
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  // Queries
  fetchCart: () => Promise<void>;
  
  // Mutations
  addItem: (product: Product, quantity?: number) => Promise<boolean>;
  removeItem: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
  clearCart: () => void;
  
  // Utilities
  setError: (error: string | null) => void;
  reset: () => void;
}

type CartStore = CartState & CartActions;

// ============================================
// Initial State
// ============================================
const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

// ============================================
// Store
// ============================================
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ========== Queries ==========
        fetchCart: async () => {
          set({ isLoading: true, error: null });
          try {
            const items = await cartApi.getCart();
            set({ items, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch cart', 
              isLoading: false 
            });
          }
        },

        // ========== Mutations ==========
        addItem: async (product, quantity = 1) => {
          set({ isLoading: true, error: null });
          try {
            await cartApi.addToCart(String(product.id), quantity);
            await get().fetchCart();
            return true;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to add item',
              isLoading: false 
            });
            return false;
          }
        },

        removeItem: async (productId) => {
          set({ isLoading: true, error: null });
          try {
            await cartApi.removeFromCart(String(productId));
            await get().fetchCart();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to remove item',
              isLoading: false 
            });
          }
        },

        updateQuantity: async (productId, quantity) => {
          if (quantity < 1) return;

          // Optimistic update
          const previousItems = get().items;
          set({
            items: previousItems.map(item =>
              String(item.product.id) === String(productId)
                ? { ...item, quantity }
                : item
            ),
          });

          try {
            await cartApi.updateQuantity(String(productId), quantity);
          } catch (error) {
            // Rollback on error
            set({ items: previousItems });
            await get().fetchCart();
          }
        },

        clearCart: () => {
          set({ items: [] });
        },

        // ========== Utilities ==========
        setError: (error) => set({ error }),
        
        reset: () => set(initialState),
      }),
      {
        name: 'panenku-cart',
        partialize: (state) => ({ items: state.items }), // Only persist items
      }
    ),
    { name: 'CartStore' }
  )
);

// ============================================
// Selectors (for performance optimization)
// ============================================
export const useCartItems = () => useCartStore((state) => state.items);

export const useCartCount = () => 
  useCartStore((state) => 
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

export const useCartLoading = () => useCartStore((state) => state.isLoading);

export const useCartError = () => useCartStore((state) => state.error);

// Check if product is in cart
export const useIsInCart = (productId: string | number) =>
  useCartStore((state) =>
    state.items.some(item => String(item.product.id) === String(productId))
  );
