import { render, screen, fireEvent } from '@testing-library/react';
import { ProductList } from '@/components/ProductList';
import { CartProvider } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { vi } from 'vitest';

// Mock useSession before any tests
vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
    signIn: vi.fn(),
    signOut: vi.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockProducts = [
    {
        id: 1,
        name: 'Beras Organik',
        price: 15000,
        unit: 'kg',
        image: 'https://via.placeholder.com/150',
        category: 'Beras',
        description: 'Beras organik berkualitas',
        stock: 100,
        farmer: 'Pak Budi',
        location: 'Jawa Barat'
    },
    {
        id: 2,
        name: 'Tomat Segar',
        price: 8000,
        unit: 'kg',
        image: 'https://via.placeholder.com/150',
        category: 'Sayuran',
        description: 'Tomat segar dari kebun',
        stock: 50,
        farmer: 'Bu Ani',
        location: 'Jawa Tengah'
    }
];

const renderWithProviders = (component: React.ReactElement) => {
    return render(
        <CartProvider>
            {component}
        </CartProvider>
    );
};

describe('ProductList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default mock return value for each test
        (useSession as any).mockReturnValue({ data: null, status: 'unauthenticated' });
    });

    it('should render all products', () => {
        renderWithProviders(<ProductList products={mockProducts} />);

        expect(screen.getByText('Beras Organik')).toBeInTheDocument();
        expect(screen.getByText('Tomat Segar')).toBeInTheDocument();
    });

    it('should filter products by search', () => {
        renderWithProviders(<ProductList products={mockProducts} />);

        const searchInput = screen.getByPlaceholderText('Cari produk...');
        fireEvent.change(searchInput, { target: { value: 'beras' } });

        expect(screen.getByText('Beras Organik')).toBeInTheDocument();
        expect(screen.queryByText('Tomat Segar')).not.toBeInTheDocument();
    });

    it('should filter products by category', () => {
        renderWithProviders(<ProductList products={mockProducts} />);

        const categoryButton = screen.getByText('Sayuran');
        fireEvent.click(categoryButton);

        expect(screen.queryByText('Beras Organik')).not.toBeInTheDocument();
        expect(screen.getByText('Tomat Segar')).toBeInTheDocument();
    });

    it('should show all products when clicking "Semua" category', () => {
        renderWithProviders(<ProductList products={mockProducts} />);

        const berasCategory = screen.getByText('Beras');
        fireEvent.click(berasCategory);

        const semuaButton = screen.getByText('Semua');
        fireEvent.click(semuaButton);

        expect(screen.getByText('Beras Organik')).toBeInTheDocument();
        expect(screen.getByText('Tomat Segar')).toBeInTheDocument();
    });

    it('should display product count', () => {
        renderWithProviders(<ProductList products={mockProducts} />);

        expect(screen.getByText('Menampilkan 2 produk')).toBeInTheDocument();
    });

    it('should show empty message when no products match search', () => {
        renderWithProviders(<ProductList products={mockProducts} />);

        const searchInput = screen.getByPlaceholderText('Cari produk...');
        fireEvent.change(searchInput, { target: { value: 'produk tidak ada' } });

        expect(screen.getByText('Tidak ada produk yang ditemukan')).toBeInTheDocument();
    });
});
