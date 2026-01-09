import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Standard colors matching the theme
const COLORS = {
    primary: '#16a34a', // green-600
    secondary: '#4b5563', // gray-600
    danger: '#dc2626', // red-600
    warning: '#ea580c', // orange-600
};

export const showAlert = {
    success: (title: string, text?: string) => {
        return MySwal.fire({
            icon: 'success',
            title,
            text,
            confirmButtonColor: COLORS.primary,
            timer: 2000,
            timerProgressBar: true,
        });
    },
    error: (title: string, text?: string) => {
        return MySwal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonColor: COLORS.primary,
        });
    },
    info: (title: string, text?: string) => {
        return MySwal.fire({
            icon: 'info',
            title,
            text,
            confirmButtonColor: COLORS.primary,
        });
    },
    confirm: async (title: string, text: string, confirmText = 'Ya, Lanjutkan') => {
        const result = await MySwal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: COLORS.danger,
            cancelButtonColor: COLORS.secondary,
            confirmButtonText: confirmText,
            cancelButtonText: 'Batal',
            reverseButtons: true,
        });
        return result.isConfirmed;
    },
    loading: (title: string = 'Mohon Tunggu...') => {
        return MySwal.fire({
            title,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    },
    close: () => {
        return MySwal.close();
    }
};
