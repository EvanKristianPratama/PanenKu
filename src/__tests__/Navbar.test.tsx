import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { vi } from 'vitest';

vi.mock('@/context/CartContext');
vi.mock('next-auth/react');
vi.mock('next/navigation');

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (usePathname as any).mockReturnValue('/');
    });

    it('should render logo and brand name', () => {
        (useCart as any).mockReturnValue({ cartCount: 0 });
        (useSession as any).mockReturnValue({ data: null });

        render(<Navbar />);

        expect(screen.getByText('PanenKu')).toBeInTheDocument();
    });

    it('should show cart badge when items exist', () => {
        (useCart as any).mockReturnValue({ cartCount: 5 });
        (useSession as any).mockReturnValue({ data: null });

        render(<Navbar />);

        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should not show cart badge when cart is empty', () => {
        (useCart as any).mockReturnValue({ cartCount: 0 });
        (useSession as any).mockReturnValue({ data: null });

        render(<Navbar />);

        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should show login button when not authenticated', () => {
        (useCart as any).mockReturnValue({ cartCount: 0 });
        (useSession as any).mockReturnValue({ data: null });

        render(<Navbar />);

        expect(screen.getByText('Masuk')).toBeInTheDocument();
    });

    it('should show user menu when authenticated', () => {
        (useCart as any).mockReturnValue({ cartCount: 0 });
        (useSession as any).mockReturnValue({
            data: { user: { name: 'Test User', email: 'test@example.com' } }
        });

        render(<Navbar />);

        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should show admin link for admin users', () => {
        (useCart as any).mockReturnValue({ cartCount: 0 });
        (useSession as any).mockReturnValue({
            data: { user: { name: 'Admin', email: 'admin@example.com', role: 'admin' } }
        });
        (usePathname as any).mockReturnValue('/admin');

        render(<Navbar />);

        // Check if there's a link to /admin
        const adminLink = screen.getByRole('link', { name: /admin/i });
        expect(adminLink).toHaveAttribute('href', '/admin');
    });
});
