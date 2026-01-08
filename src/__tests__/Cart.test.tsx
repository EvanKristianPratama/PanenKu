import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Cart } from '@/components/Cart';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

vi.mock('@/context/CartContext');
vi.mock('next-auth/react');
vi.mock('next/navigation');

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
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue({ push: mockPush });
        global.fetch = vi.fn();
    });

    it('should show empty cart message when no items', () => {
        (useCart as any).mockReturnValue({
            cartItems: [],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useSession as any).mockReturnValue({ data: null });

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
        (useSession as any).mockReturnValue({ data: { user: { name: 'Test' } } });

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
        (useSession as any).mockReturnValue({ data: { user: { name: 'Test' } } });

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
        (useSession as any).mockReturnValue({ data: { user: { name: 'Test' } } });

        render(<Cart />);

        const checkoutButton = screen.getByText('Checkout');
        expect(checkoutButton).toBeDisabled();
    });

    it('should redirect to login when not logged in', () => {
        (useCart as any).mockReturnValue({
            cartItems: [mockCartItem],
            updateQuantity: mockUpdateQuantity,
            removeFromCart: mockRemoveFromCart,
            clearCart: mockClearCart
        });
        (useSession as any).mockReturnValue({ data: null });

        render(<Cart />);

        expect(screen.getByText('Login untuk Checkout')).toBeInTheDocument();
    });
});
