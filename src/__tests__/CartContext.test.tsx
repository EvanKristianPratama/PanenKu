import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';
import { dummyService } from '@/services/dummy';

// Mock dummyService
vi.mock('@/services/dummy', () => ({
    dummyService: {
        addToCart: vi.fn((product, quantity) => Promise.resolve([{ product, quantity }])),
        getCart: vi.fn().mockResolvedValue([]),
        updateCartQuantity: vi.fn(),
        removeFromCart: vi.fn(),
        checkout: vi.fn(),
    },
}));

describe('CartContext', () => {
    it('should provide cart values', async () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        expect(result.current.cartItems).toEqual([]);
        expect(result.current.cartCount).toBe(0);
    });

    it('should call service when adding to cart', async () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        });

        const mockProduct = {
            id: 1,
            name: 'Test Product',
            price: 10000,
            stock: 10,
            category: 'test',
            unit: 'kg',
            image: 'test.jpg',
            farmer: 'Farmer',
            location: 'Loc',
            description: 'Desc'
        };

        await act(async () => {
            await result.current.addToCart(mockProduct, 2);
        });

        expect(dummyService.addToCart).toHaveBeenCalledWith(mockProduct, 2);
    });
});
