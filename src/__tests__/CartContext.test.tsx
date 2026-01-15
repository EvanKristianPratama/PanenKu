import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';
import { vi } from 'vitest';

// Mock cartApi service
vi.mock('@/services/api/cartApi', () => ({
    cartApi: {
        getCart: vi.fn().mockResolvedValue([]),
        addToCart: vi.fn((productId, quantity) => Promise.resolve({ success: true })),
        updateQuantity: vi.fn().mockResolvedValue({ success: true }),
        removeFromCart: vi.fn().mockResolvedValue({ success: true }),
    },
}));

// Mock next-auth session
vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => ({ 
        data: { user: { id: 'test-user-id' } }, 
        status: 'authenticated' 
    })),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('CartContext', () => {
    it('should provide cart values', async () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        expect(result.current.cartItems).toEqual([]);
        expect(result.current.cartCount).toBe(0);
    });

    it('should have addToCart function', async () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        expect(typeof result.current.addToCart).toBe('function');
    });

    it('should have updateQuantity function', async () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        expect(typeof result.current.updateQuantity).toBe('function');
    });

    it('should have removeFromCart function', async () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        expect(typeof result.current.removeFromCart).toBe('function');
    });

    it('should have clearCart function', async () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        expect(typeof result.current.clearCart).toBe('function');
    });
});
