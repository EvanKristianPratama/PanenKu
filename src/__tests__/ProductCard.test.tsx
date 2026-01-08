import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@/context/CartContext');
vi.mock('next-auth/react');
vi.mock('next/navigation');

const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 10000,
    unit: 'kg',
    image: 'https://via.placeholder.com/150',
    category: 'Sayuran',
    description: 'Test description',
    stock: 10,
    farmer: 'Test Farmer',
    location: 'Test Location'
};

describe('ProductCard', () => {
    const mockAddToCart = vi.fn();
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useCart as any).mockReturnValue({ addToCart: mockAddToCart });
        (useRouter as any).mockReturnValue({ push: mockPush });
    });

    it('should render product information correctly', () => {
        (useSession as any).mockReturnValue({ data: { user: { name: 'Test User' } } });

        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText(/Rp 10.000/)).toBeInTheDocument();
        expect(screen.getByText('Sayuran')).toBeInTheDocument();
    });

    it('should add to cart when logged in', () => {
        (useSession as any).mockReturnValue({ data: { user: { name: 'Test User' } } });

        render(<ProductCard product={mockProduct} />);

        const addButton = screen.getByRole('button', { name: /tambah/i });
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('should redirect to login when not logged in', () => {
        (useSession as any).mockReturnValue({ data: null });

        render(<ProductCard product={mockProduct} />);

        const addButton = screen.getByRole('button', { name: /tambah/i });
        fireEvent.click(addButton);

        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should navigate to product detail on card click', () => {
        (useSession as any).mockReturnValue({ data: null });

        render(<ProductCard product={mockProduct} />);

        const card = screen.getByText('Test Product').closest('a');
        expect(card).toHaveAttribute('href', '/product/1');
    });
});
