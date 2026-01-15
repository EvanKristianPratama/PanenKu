import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Register } from '@/components/Register';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('next-auth/react');
vi.mock('next/navigation');

describe('Register Component', () => {
    const mockPush = vi.fn();
    const mockRefresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue({
            push: mockPush,
            refresh: mockRefresh
        });
        global.fetch = vi.fn();
    });

    it('should render registration form correctly', () => {
        render(<Register />);

        expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/konfirmasi/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /daftar sekarang/i })).toBeInTheDocument();
    });

    it('should show error when passwords do not match', async () => {
        const user = userEvent.setup();
        render(<Register />);

        await user.type(screen.getByLabelText(/nama lengkap/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'password123');
        await user.type(screen.getByLabelText(/konfirmasi/i), 'different');

        await user.click(screen.getByRole('button', { name: /daftar sekarang/i }));

        await waitFor(() => {
            expect(screen.getByText('Password tidak cocok')).toBeInTheDocument();
        });
    });

    it('should show error when password is too short', async () => {
        const user = userEvent.setup();
        render(<Register />);

        await user.type(screen.getByLabelText(/nama lengkap/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^password$/i), '12345');
        await user.type(screen.getByLabelText(/konfirmasi/i), '12345');

        await user.click(screen.getByRole('button', { name: /daftar sekarang/i }));

        await waitFor(() => {
            expect(screen.getByText('Password minimal 6 karakter')).toBeInTheDocument();
        });
    });

    it('should register successfully and redirect', async () => {
        const user = userEvent.setup();

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        });

        (signIn as any).mockResolvedValueOnce({ ok: true });

        render(<Register />);

        await user.type(screen.getByLabelText(/nama lengkap/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'password123');
        await user.type(screen.getByLabelText(/konfirmasi/i), 'password123');

        await user.click(screen.getByRole('button', { name: /daftar sekarang/i }));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });
});
