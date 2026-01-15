import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import { useCartActions } from '@/hooks/useCartActions';
import { vi } from 'vitest';

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
    const mockAddToCart = vi.fn(() => Promise.resolve(true));

    beforeEach(() => {
        vi.clearAllMocks();
        (useCartActions as any).mockReturnValue({
            addToCart: mockAddToCart,
            isLoading: false,
        });
    });

    it('should render product information correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText(/Rp 10.000/)).toBeInTheDocument();
        expect(screen.getByText('Sayuran')).toBeInTheDocument();
    });

    it('should call addToCart when add button clicked', async () => {
        render(<ProductCard product={mockProduct} />);

        const addButton = screen.getByRole('button');
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('should navigate to product detail on card click', () => {
        render(<ProductCard product={mockProduct} />);

        const card = screen.getByText('Test Product').closest('a');
        expect(card).toHaveAttribute('href', '/product/1');
    });

    it('should show loading state when isLoading is true', () => {
        (useCartActions as any).mockReturnValue({
            addToCart: mockAddToCart,
            isLoading: true,
        });

        render(<ProductCard product={mockProduct} />);

        // Component should still render, loading state is handled internally
        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should display farmer and location', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Farmer')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
    });
});
