import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// ============================================
// Global Mocks
// ============================================

// Mock next/navigation
// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
    })),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    redirect: vi.fn(),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

// Mock sweetalert
vi.mock('@/lib/sweetalert', () => ({
    showAlert: {
        success: vi.fn(),
        error: vi.fn(),
        confirm: vi.fn(() => Promise.resolve(true)),
    },
}));

// ============================================
// Custom Hooks Mocks
// ============================================

// Default mock for useAuth hook
vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(() => ({
        user: null,
        userId: null,
        userName: 'Guest',
        userRole: null,
        isAuthenticated: false,
        isLoading: false,
        isAdmin: false,
        isFarmer: false,
        isUser: false,
        logout: vi.fn(),
        requireAuth: vi.fn(() => false),
    })),
}));

// Default mock for useCartActions hook
vi.mock('@/hooks/useCartActions', () => ({
    useCartActions: vi.fn(() => ({
        addToCart: vi.fn(() => Promise.resolve(true)),
        removeFromCart: vi.fn(() => Promise.resolve(true)),
        updateQuantity: vi.fn(() => Promise.resolve(true)),
        refreshCart: vi.fn(() => Promise.resolve()),
        isAdding: false,
        isRemoving: false,
        isUpdating: false,
    })),
}));

// Default mock for useNavbarScroll hook
vi.mock('@/hooks/useNavbarScroll', () => ({
    useNavbarScroll: vi.fn(() => ({
        isScrolled: false,
        isVisible: true,
    })),
}));

// Default mock for useSupportChat hook
vi.mock('@/hooks/useSupportChat', () => ({
    useSupportChat: vi.fn(() => ({
        activeChatRoom: null,
        isLoading: false,
        openSupportChat: vi.fn(),
        closeSupportChat: vi.fn(),
    })),
}));

// Default mock for useFarmerChat hook
vi.mock('@/hooks/useFarmerChat', () => ({
    useFarmerChat: vi.fn(() => ({
        activeChatRoom: null,
        isLoading: false,
        openFarmerChat: vi.fn(),
        closeFarmerChat: vi.fn(),
    })),
}));

// Mock CartContext (backward compatibility)
vi.mock('@/context/CartContext', () => ({
    useCart: vi.fn(() => ({
        cartItems: [],
        cartCount: 0,
        cartTotal: 0,
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        isLoading: false,
    })),
    CartProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock firebase exports to avoid initializing real Firebase during tests
vi.mock('@/lib/firebase', () => ({
    auth: {},
    db: {},
}));
