import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '@/components/Login';
import { signIn } from 'next-auth/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Note: Mocks are configured in setup.ts

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form correctly', () => {
        render(<Login />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /masuk sekarang/i })).toBeInTheDocument();
    });

    it('submits form with credentials', async () => {
        const user = userEvent.setup();
        (signIn as any).mockResolvedValue({ ok: true });

        render(<Login />);

        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'password123');

        // Find and click the submit button
        const submitButton = screen.getByRole('button', { name: /masuk sekarang/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith('credentials', {
                email: 'test@example.com',
                password: 'password123',
                redirect: false,
            });
        });
    });

    it('shows Google sign in button', () => {
        render(<Login />);
        expect(screen.getByText(/Masuk dengan Google/i)).toBeInTheDocument();
    });
});
