import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';
import { useSupportChat } from '@/hooks/useSupportChat';
import { usePathname } from 'next/navigation';
import { vi } from 'vitest';

// Mocks are already set up in setup.ts, but we can override them per test

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (usePathname as any).mockReturnValue('/');
        (useNavbarScroll as any).mockReturnValue({ isScrolled: false, isVisible: true });
        (useSupportChat as any).mockReturnValue({
            activeChatRoom: null,
            isLoading: false,
            openSupportChat: vi.fn(),
            closeSupportChat: vi.fn(),
        });
    });

    it('should render logo and brand name', () => {
        (useAuth as any).mockReturnValue({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isFarmer: false,
            logout: vi.fn(),
        });

        render(<Navbar />);

        expect(screen.getByText('PanenKu')).toBeInTheDocument();
    });

    it('should show login button when not authenticated', () => {
        (useAuth as any).mockReturnValue({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isFarmer: false,
            logout: vi.fn(),
        });

        render(<Navbar />);

        expect(screen.getByText('Masuk')).toBeInTheDocument();
    });

    it('should show user menu when authenticated', () => {
        (useAuth as any).mockReturnValue({
            user: { name: 'Test User', email: 'test@example.com' },
            isAuthenticated: true,
            isAdmin: false,
            isFarmer: false,
            logout: vi.fn(),
        });

        render(<Navbar />);

        // Check for first name displayed
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should show admin link for admin users', () => {
        (useAuth as any).mockReturnValue({
            user: { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
            isAuthenticated: true,
            isAdmin: true,
            isFarmer: false,
            logout: vi.fn(),
        });
        (usePathname as any).mockReturnValue('/admin');

        render(<Navbar />);

        // Check if there's a link to /admin
        const adminLink = screen.getByRole('link', { name: /admin/i });
        expect(adminLink).toHaveAttribute('href', '/admin');
    });

    it('should show farmer dashboard link for farmer users', () => {
        (useAuth as any).mockReturnValue({
            user: { name: 'Farmer User', email: 'farmer@example.com', role: 'farmer' },
            isAuthenticated: true,
            isAdmin: false,
            isFarmer: true,
            logout: vi.fn(),
        });

        render(<Navbar />);

        expect(screen.getByText(/Petani Dashboard/)).toBeInTheDocument();
    });

    it('should handle scroll state correctly', () => {
        (useAuth as any).mockReturnValue({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isFarmer: false,
            logout: vi.fn(),
        });
        (useNavbarScroll as any).mockReturnValue({ isScrolled: true, isVisible: true });

        render(<Navbar />);

        // When scrolled, navbar should have different styling (white background)
        const nav = screen.getByRole('navigation');
        expect(nav.className).toContain('bg-white');
    });
});
