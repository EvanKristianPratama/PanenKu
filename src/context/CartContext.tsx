"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { CartItem, Product } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session, status } = useSession();

    // Fetch cart from MongoDB
    const refreshCart = useCallback(async () => {
        if (status === 'loading') return;

        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            setCartItems(data.items || []);
        } catch (error) {
            console.error('Failed to refresh cart:', error);
        }
    }, [status]);

    // Load cart when session changes
    useEffect(() => {
        if (status === 'authenticated') {
            refreshCart();
        } else if (status === 'unauthenticated') {
            setCartItems([]);
        }
    }, [status, refreshCart]);

    const addToCart = async (product: Product, quantity: number = 1) => {
        if (!session) {
            toast.error('Silakan login terlebih dahulu');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: String(product.id), quantity }),
            });

            if (res.ok) {
                await refreshCart();
                toast.success(`${product.name} ditambahkan ke keranjang`);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Gagal menambah ke keranjang');
            }
        } catch (error) {
            toast.error('Gagal menambah ke keranjang');
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId: string | number) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cart?productId=${String(productId)}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await refreshCart();
                toast.info("Produk dihapus dari keranjang");
            }
        } catch (error) {
            toast.error('Gagal menghapus dari keranjang');
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (productId: string | number, quantity: number) => {
        if (quantity < 1) return;

        // Optimistic update
        setCartItems(prev => prev.map(item =>
            String(item.product.id) === String(productId)
                ? { ...item, quantity }
                : item
        ));

        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: String(productId), quantity }),
            });

            if (!res.ok) {
                // Revert on error
                await refreshCart();
            }
        } catch (error) {
            await refreshCart();
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
