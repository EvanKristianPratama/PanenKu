import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Register } from '@/components/Register';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

vi.mock('next-auth/react');
vi.mock('next/navigation');

describe('Register', () => {
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

    it('should render registration form', () => {
        render(<Register />);

        expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getAllByLabelText(/password/i)[0]).toBeInTheDocument();
        expect(screen.getByText('Daftar Sekarang')).toBeInTheDocument();
    });

    it('should show error when passwords do not match', async () => {
        render(<Register />);

        fireEvent.change(screen.getByLabelText(/nama lengkap/i), {
            target: { value: 'Test User' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
            target: { value: 'password123' }
        });
        fireEvent.change(screen.getByLabelText(/konfirmasi/i), {
            target: { value: 'different' }
        });

        fireEvent.click(screen.getByText('Daftar Sekarang'));

        await waitFor(() => {
            expect(screen.getByText('Password tidak cocok')).toBeInTheDocument();
        });
    });

    it('should show error when password is too short', async () => {
        render(<Register />);

        fireEvent.change(screen.getByLabelText(/nama lengkap/i), {
            target: { value: 'Test User' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
            target: { value: '12345' }
        });
        fireEvent.change(screen.getByLabelText(/konfirmasi/i), {
            target: { value: '12345' }
        });

        fireEvent.click(screen.getByText('Daftar Sekarang'));

        await waitFor(() => {
            expect(screen.getByText('Password minimal 6 karakter')).toBeInTheDocument();
        });
    });

    it('should register successfully and redirect', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        });

        (signIn as any).mockResolvedValueOnce({ ok: true });

        render(<Register />);

        fireEvent.change(screen.getByLabelText(/nama lengkap/i), {
            target: { value: 'Test User' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
            target: { value: 'password123' }
        });
        fireEvent.change(screen.getByLabelText(/konfirmasi/i), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getByText('Daftar Sekarang'));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });
});
