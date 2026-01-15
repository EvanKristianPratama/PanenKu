"use client";

/**
 * CartContext - Backward Compatibility Layer
 * 
 * This context now uses Zustand store internally but maintains
 * the same API for backward compatibility with existing components.
 * 
 * For new components, prefer using:
 * - useCartActions() hook for actions with auth check
 * - useCartStore() selectors for state
 */

import { createContext, useContext, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCartStore, useCartItems, useCartCount, useCartLoading } from "@/stores/cartStore";
import { MESSAGES } from "@/constants/messages";

// ============================================
// Types (unchanged for backward compatibility)
// ============================================
interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    isLoading: boolean;
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string | number) => Promise<void>;
    updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
    clearCart: () => void;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================
// Provider (now wraps Zustand store)
// ============================================
export function CartProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    
    // Use Zustand store
    const cartItems = useCartItems();
    const cartCount = useCartCount();
    const isLoading = useCartLoading();
    const { 
        fetchCart, 
        addItem, 
        removeItem, 
        updateQuantity: storeUpdateQuantity, 
        clearCart: storeClearCart,
        reset 
    } = useCartStore();

    // Sync cart with session state
    useEffect(() => {
        if (status === 'authenticated') {
            fetchCart();
        } else if (status === 'unauthenticated') {
            reset();
        }
    }, [status, fetchCart, reset]);

    // Wrapper functions with toast notifications (backward compat)
    const addToCart = async (product: Product, quantity: number = 1) => {
        if (!session) {
            toast.error(MESSAGES.AUTH.LOGIN_REQUIRED);
            return;
        }

        const success = await addItem(product, quantity);
        if (success) {
            toast.success(MESSAGES.CART.ADDED(product.name));
        } else {
            toast.error(MESSAGES.CART.ADD_ERROR);
        }
    };

    const removeFromCart = async (productId: string | number) => {
        await removeItem(productId);
        toast.info(MESSAGES.CART.REMOVED);
    };

    const updateQuantity = async (productId: string | number, quantity: number) => {
        await storeUpdateQuantity(productId, quantity);
    };

    const clearCart = () => {
        storeClearCart();
    };

    const refreshCart = async () => {
        await fetchCart();
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            isLoading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            refreshCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
