import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Cart } from '@/components/Cart';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { vi } from 'vitest';

const mockCartItem = {
    product: {
        id: 1,
        name: 'Test Product',
        price: 10000,
        unit: 'kg',
        image: 'https://via.placeholder.com/150',
        category: 'Sayuran',
        description: 'Test',
        stock: 10,
        farmer: 'Test',
        location: 'Test'
    },
    quantity: 2
};

describe('Cart', () => {
    const mockUpdateQuantity = vi.fn();
    const mockRemoveFromCart = vi.fn();
    const mockClearCart = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ user: {} })
            })
        ) as any;
    });

    it('should show empty cart message when no items', () => {
        (useCart as any).mockReturnValue({
            cartItems: [],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useAuth as any).mockReturnValue({ isAuthenticated: false });

        render(<Cart />);

        expect(screen.getByText('Keranjang Kosong')).toBeInTheDocument();
    });

    it('should display cart items correctly', () => {
        (useCart as any).mockReturnValue({
            cartItems: [mockCartItem],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useAuth as any).mockReturnValue({ 
            isAuthenticated: true,
            user: { name: 'Test User' }
        });

        render(<Cart />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText(/Rp 10.000/)).toBeInTheDocument();
    });

    it('should update quantity when plus button clicked', () => {
        (useCart as any).mockReturnValue({
            cartItems: [mockCartItem],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useAuth as any).mockReturnValue({ 
            isAuthenticated: true,
            user: { name: 'Test User' }
        });

        render(<Cart />);

        const plusButtons = screen.getAllByRole('button');
        const plusButton = plusButtons.find(btn => btn.querySelector('svg'));

        if (plusButton) {
            fireEvent.click(plusButton);
        }
    });

    it('should require shipping address for checkout', () => {
        (useCart as any).mockReturnValue({
            cartItems: [mockCartItem],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useAuth as any).mockReturnValue({ 
            isAuthenticated: true,
            user: { name: 'Test User' }
        });

        render(<Cart />);

        const checkoutButton = screen.getByText('Checkout Sekarang');
        expect(checkoutButton).toBeDisabled();
    });

    it('should show login button when not logged in', () => {
        (useCart as any).mockReturnValue({
            cartItems: [mockCartItem],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useAuth as any).mockReturnValue({ isAuthenticated: false });

        render(<Cart />);

        expect(screen.getByText('Login untuk Checkout')).toBeInTheDocument();
    });

    it('should show shipping info form when authenticated', () => {
        (useCart as any).mockReturnValue({
            cartItems: [mockCartItem],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useAuth as any).mockReturnValue({ 
            isAuthenticated: true,
            user: { name: 'Test User' }
        });

        render(<Cart />);

        expect(screen.getByText('Informasi Pengiriman')).toBeInTheDocument();
    });
});
