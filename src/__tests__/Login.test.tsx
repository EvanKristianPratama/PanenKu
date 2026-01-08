import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '@/components/Login';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock dependencies
vi.mock('next-auth/react', () => ({
    signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn().mockReturnValue({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

// Mock Sonner toast to avoid errors provided via context usually
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('Login Component', () => {
    it('renders login form correctly', () => {
        render(<Login />);
        expect(screen.getByPlaceholderText('nama@email.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
    });

    it('submits form with credentials', async () => {
        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('nama@email.com'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /masuk/i }));

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith('credentials', {
                email: 'test@example.com',
                password: 'password123',
                redirect: false,
            });
        });
    });
});
